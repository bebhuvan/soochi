/**
 * POST /api/enrich  { url, token }  ->  { draft, sources }
 *
 * Takes a URL and drafts an entry from it: fetches the page, searches for
 * corroborating detail, and returns a filled-in form for a human to edit.
 * It never writes anything — the draft goes back to the submitter, who
 * fixes it and submits. Nothing reaches the repository un-reviewed.
 */

import Anthropic from '@anthropic-ai/sdk'
import { KINDS, KIND_NOTES, TOPICS, GEOGRAPHIES, LICENSING, ACCESS, ORG_TYPES } from '../../src/taxonomy'
import { verifyTurnstile, tooMany, json, readJson } from '../_lib/guard'
import type { RateLimiter } from '../_lib/guard'

interface Env {
  ANTHROPIC_API_KEY: string
  TURNSTILE_SECRET: string
  ENRICH_RATE_LIMIT?: RateLimiter
}

interface Context {
  request: Request
  env: Env
}

const keys = (o: object) => Object.keys(o)

/* Structured outputs mean the model cannot hand back prose we then have to
   parse. The enums are generated from the taxonomy, so a term that isn't
   in the vocabulary is unrepresentable rather than merely discouraged. */
const DRAFT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['name', 'blurb', 'kind', 'topics', 'geography', 'confidence'],
  properties: {
    name: { type: 'string', description: 'What the thing calls itself. No tagline appended.' },
    blurb: {
      type: 'string',
      description:
        'One sentence, under 160 characters, saying what it does — not what it is called. ' +
        'Written as if to a colleague. No trailing full stop, no "A platform that…" opener.',
    },
    kind: { type: 'string', enum: keys(KINDS) },
    orgType: { type: 'string', enum: [...keys(ORG_TYPES), 'unknown'] },
    topics: { type: 'array', items: { type: 'string', enum: keys(TOPICS) }, minItems: 1, maxItems: 4 },
    geography: { type: 'array', items: { type: 'string', enum: keys(GEOGRAPHIES) }, minItems: 1 },
    licensing: { type: 'string', enum: keys(LICENSING) },
    access: { type: 'string', enum: keys(ACCESS) },
    alternateNames: { type: 'array', items: { type: 'string' }, description: 'Acronyms and former names.' },
    founded: { type: 'integer', description: 'Year founded. Omit unless stated on a source.' },
    people: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['name'],
        properties: { name: { type: 'string' }, role: { type: 'string' } },
      },
      description: 'Named founders or leads, only where a source states them.',
    },
    links: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['label', 'url'],
        properties: { label: { type: 'string' }, url: { type: 'string' } },
      },
      description: 'YouTube, X, Mastodon, GitHub, newsletter — only URLs you actually saw.',
    },
    location: {
      type: 'object',
      additionalProperties: false,
      properties: { city: { type: 'string' }, region: { type: 'string' } },
      description: 'Only for kinds with a physical home. Omit for a global dataset or a collective.',
    },
    languages: { type: 'array', items: { type: 'string' }, description: 'BCP-47 tags, e.g. en, hi, ta.' },
    confidence: {
      type: 'string',
      enum: ['high', 'medium', 'low'],
      description: 'low if the page was thin, ambiguous, or you inferred more than you read.',
    },
    uncertain: {
      type: 'array',
      items: { type: 'string' },
      description: 'Field names you are least sure about, so the human checks those first.',
    },
  },
} as const

const SYSTEM = `You draft entries for a public directory of civic organisations, datasets, tools and archives. A human reviews and edits everything you produce before it is published — your job is a good first draft, not a final answer.

Read the page at the URL. Search only if the page leaves a required field genuinely unresolved.

Rules that matter more than completeness:
- Never state a fact you did not read on a source. Omit an optional field rather than guessing it. An empty field costs a reviewer nothing; a plausible invented one costs them trust in every other field.
- The blurb says what the thing DOES and who it is for. "India's open data community — mailing list, city chapters, and the maintainers behind several widely used boundary datasets" is right. "A leading platform for open data" is marketing and is wrong.
- Pick the narrowest true kind. A body that publishes a dataset is an organisation; the dataset itself is a dataset.
- Only set location for something with a physical home. A collaboratively built map has no head office.
- Set confidence to low when the page was thin or you inferred more than you read, and list the shakiest fields in uncertain.

Kinds: ${Object.entries(KIND_NOTES).map(([k, v]) => `${k} — ${v}`).join('; ')}`

export const onRequestPost = async (ctx: Context): Promise<Response> => {
  const body = await readJson<{ url?: string; token?: string }>(ctx.request)
  if (!body) return json({ error: 'Expected a JSON body.' }, 400)

  const target = (body.url ?? '').trim()
  if (!/^https?:\/\/\S+\.\S+/.test(target)) {
    return json({ error: 'Give me a full URL, starting with https://' }, 400)
  }

  if (!(await verifyTurnstile(ctx.env.TURNSTILE_SECRET, body.token, ctx.request))) {
    return json({ error: 'Could not verify you are human. Reload and try again.' }, 403)
  }

  // Enrichment costs money on every call, so it is rate limited harder
  // than submission is.
  const limited = await tooMany(ctx.env.ENRICH_RATE_LIMIT, ctx.request, 'enrich')
  if (limited) return json({ error: 'That is a lot of lookups. Try again in a minute.' }, 429)

  if (!ctx.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY is not configured')
    return json({ error: 'Automatic lookup is not configured yet. Fill the form in by hand.' }, 503)
  }

  const client = new Anthropic({ apiKey: ctx.env.ANTHROPIC_API_KEY })

  try {
    const res = await client.beta.messages.create({
      model: 'claude-opus-5',
      max_tokens: 8000,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      system: SYSTEM,
      // Thinking stays on. With it disabled the model can write a tool
      // call into visible text instead of calling the tool — the search
      // silently never runs and the draft is invented instead of read.
      output_config: {
        effort: 'medium',
        format: { type: 'json_schema', schema: DRAFT_SCHEMA },
      },
      tools: [
        { type: 'web_fetch_20260209', name: 'web_fetch', max_uses: 4 },
        { type: 'web_search_20260209', name: 'web_search', max_uses: 3 },
      ],
      messages: [{ role: 'user', content: `Draft a directory entry for: ${target}` }],
    })

    if (res.stop_reason === 'refusal') {
      return json({ error: 'Could not draft this one. Fill the form in by hand.' }, 422)
    }

    const draft = (res as { parsed_output?: unknown }).parsed_output
      ?? JSON.parse(res.content.filter((b) => b.type === 'text').map((b) => b.text).join(''))

    // What it actually looked at, so the reviewer can check the sources.
    const sources = res.content.flatMap((b) =>
      b.type === 'web_search_tool_result' && Array.isArray(b.content)
        ? b.content.flatMap((r) => ('url' in r && r.url ? [{ url: r.url, title: (r as { title?: string }).title ?? '' }] : []))
        : [],
    )

    return json({ draft: { ...(draft as object), url: target }, sources })
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      return json({ error: 'Busy right now. Try again in a minute.' }, 429)
    }
    console.error('enrich failed', err)
    return json({ error: 'Lookup failed. Fill the form in by hand — it still works.' }, 502)
  }
}
