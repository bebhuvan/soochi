/**
 * POST /api/submit  { entry fields, token }  ->  { pr }
 *
 * Validates against the same schema the site build enforces, writes an
 * entry file to a new branch, and opens a pull request. It never merges:
 * a human reads the diff. The submitter never sees GitHub.
 */

import { submissionSchema, toMarkdown, slugify } from '../../src/lib/entry-schema'
import { verifyTurnstile, tooMany, json, readJson } from '../_lib/guard'
import type { RateLimiter } from '../_lib/guard'

interface Env {
  GITHUB_TOKEN: string
  GITHUB_REPO: string // "owner/repo"
  GITHUB_BASE_BRANCH?: string
  TURNSTILE_SECRET: string
  SUBMIT_RATE_LIMIT?: RateLimiter
}

interface Context {
  request: Request
  env: Env
}

const API = 'https://api.github.com'

async function gh<T>(env: Env, path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API}/repos/${env.GITHUB_REPO}${path}`, {
    ...init,
    headers: {
      authorization: `Bearer ${env.GITHUB_TOKEN}`,
      accept: 'application/vnd.github+json',
      'x-github-api-version': '2022-11-28',
      'user-agent': 'soochi-submissions',
      'content-type': 'application/json',
      ...(init.headers ?? {}),
    },
  })
  if (!res.ok) {
    throw Object.assign(new Error(`GitHub ${res.status}: ${await res.text()}`), { status: res.status })
  }
  return res.json() as Promise<T>
}

export const onRequestPost = async (ctx: Context): Promise<Response> => {
  const body = await readJson<Record<string, unknown>>(ctx.request)
  if (!body) return json({ error: 'Expected a JSON body.' }, 400)

  const token = body.token as string | undefined
  if (!(await verifyTurnstile(ctx.env.TURNSTILE_SECRET, token, ctx.request))) {
    return json({ error: 'Could not verify you are human. Reload and try again.' }, 403)
  }

  const limited = await tooMany(ctx.env.SUBMIT_RATE_LIMIT, ctx.request, 'submit')
  if (limited) return json({ error: 'That is a lot of submissions. Try again in a minute.' }, 429)

  // The same schema the build enforces, so the form cannot accept
  // something CI would then reject.
  const parsed = submissionSchema.safeParse(body)
  if (!parsed.success) {
    return json(
      {
        error: 'Some fields need fixing.',
        fields: parsed.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
      },
      422,
    )
  }
  const entry = parsed.data

  if (!ctx.env.GITHUB_TOKEN || !ctx.env.GITHUB_REPO) {
    console.error('GITHUB_TOKEN / GITHUB_REPO not configured')
    return json({ error: 'Submissions are not configured yet. Use the GitHub form instead.' }, 503)
  }

  const slug = slugify(entry.name)
  if (!slug) return json({ error: 'That name does not produce a usable filename.' }, 422)

  const path = `src/content/entries/${slug}.md`
  const base = ctx.env.GITHUB_BASE_BRANCH ?? 'main'

  try {
    // Already listed? Say so plainly instead of opening a duplicate PR.
    const existing = await fetch(`${API}/repos/${ctx.env.GITHUB_REPO}/contents/${path}?ref=${base}`, {
      headers: {
        authorization: `Bearer ${ctx.env.GITHUB_TOKEN}`,
        accept: 'application/vnd.github+json',
        'user-agent': 'soochi-submissions',
      },
    })
    if (existing.ok) {
      return json({ error: `${entry.name} is already in the index.`, existing: `/e/${slug}` }, 409)
    }

    const ref = await gh<{ object: { sha: string } }>(ctx.env, `/git/ref/heads/${base}`)
    const branch = `entry/${slug}-${Date.now().toString(36)}`

    await gh(ctx.env, '/git/refs', {
      method: 'POST',
      body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: ref.object.sha }),
    })

    const markdown = toMarkdown(entry, new Date().toISOString())
    await gh(ctx.env, `/contents/${path}`, {
      method: 'PUT',
      body: JSON.stringify({
        message: `Add ${entry.name}`,
        content: btoa(String.fromCharCode(...new TextEncoder().encode(markdown))),
        branch,
      }),
    })

    const credit = entry.submittedBy ? `Submitted by ${entry.submittedBy}.` : 'Submitted anonymously.'
    const pr = await gh<{ html_url: string; number: number }>(ctx.env, '/pulls', {
      method: 'POST',
      body: JSON.stringify({
        title: `Add ${entry.name}`,
        head: branch,
        base,
        body: [
          `Submitted through the form on the site. ${credit}`,
          '',
          `**Link:** ${entry.url}`,
          '',
          'Before merging, check that the link resolves, the sentence reads like the',
          'others, and the tags are the ones you would have chosen.',
        ].join('\n'),
      }),
    })

    return json({ ok: true, pr: pr.html_url, number: pr.number })
  } catch (err) {
    console.error('submit failed', err)
    const status = (err as { status?: number }).status
    if (status === 403 || status === 401) {
      return json({ error: 'Submissions are misconfigured. Please open an issue instead.' }, 503)
    }
    return json({ error: 'Could not file that. Try again, or open an issue.' }, 502)
  }
}
