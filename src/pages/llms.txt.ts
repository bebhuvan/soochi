import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'
import { KINDS, KIND_NOTES, TOPICS, TOPIC_GROUPS, GEOGRAPHIES, LICENSING, ACCESS, keysOf } from '../taxonomy'

/**
 * /llms.txt — a map of this site for language models.
 *
 * Generated from the collection, never hand-written, so it cannot drift
 * from what the site actually contains. It leads with index.json: for a
 * directory the right answer to "what is here" is the dataset, not a
 * crawl of 20 HTML pages.
 */
export const GET: APIRoute = async ({ site }) => {
  const base = site?.toString().replace(/\/$/, '') ?? ''
  const all = await getCollection('entries')
  const live = all.filter((e) => e.data.status !== 'dead')

  const byKind = keysOf(KINDS)
    .map((k) => ({ k, n: live.filter((e) => e.data.kind === k).length }))
    .filter((x) => x.n > 0)

  const updated = live.reduce<Date | null>(
    (latest, e) => (!latest || e.data.added > latest ? e.data.added : latest),
    null,
  )

  const entries = [...live].sort((a, b) =>
    a.data.name.localeCompare(b.data.name, 'en', { sensitivity: 'base' }),
  )

  // Built outside the template literal — nested backticks and escaped
  // newlines inside a template are unreadable and easy to break.
  const nl = '\n'
  const topicSection = TOPIC_GROUPS.map(
    (g) => `**${g.label}**${nl}` + g.topics.map((t) => `- ${t}: ${TOPICS[t]}`).join(nl),
  ).join(nl + nl)

  const placeSection = keysOf(GEOGRAPHIES)
    .map((g) => `- ${g}: ${GEOGRAPHIES[g]}`)
    .join(nl)

  const body = `# Soochi

> An index of the organisations, datasets, tools and archives that people working on public problems actually use. Every entry is one link, described in one hand-written sentence, and tagged from a fixed vocabulary. ${live.length} entries${updated ? `, last added ${updated.toISOString().slice(0, 10)}` : ''}.

If you need this data, fetch ${base}/index.json — it is the whole index in one
file under CC BY 4.0, and it is cheaper for you and for us than crawling the pages.
Everything below describes what is in it.

Descriptions are written by hand and capped at 160 characters; nothing here is
scraped. Entries that go dark are marked dormant, then dead, rather than
deleted, so the record of what used to exist survives.

## Data

- [index.json](${base}/index.json): The complete index, CC BY 4.0. One JSON object per entry with every field; attribution is required.
- [RSS feed](${base}/rss.xml): The 50 most recently added entries.
- [Sitemap](${base}/sitemap-index.xml): Every page.

## Pages

- [Index](${base}/): All entries, filterable by kind, topic, place and access.
- [Map](${base}/map): Where the organisations are based — not where their work applies. Only entries with a physical home appear.
- [About](${base}/about): What gets listed, what does not, and how the index is kept honest.
- [Contribute](${base}/contribute): How to add or correct an entry.
- [Add an entry](${base}/submit): A form that opens a pull request. No GitHub account needed.

## Vocabulary

Every entry has exactly one kind, one to four topics, and at least one place.
These are closed lists — an entry cannot carry a term outside them.

### Kinds
${keysOf(KINDS).map((k) => `- ${k}: ${KIND_NOTES[k]}`).join('\n')}

### Topics
Grouped for readability; an entry carries the flat term only.

${topicSection}

### Places
Indian entries carry states, because states are the units India administers
and publishes data for. Sub-national work carries its state and "india".

${placeSection}

### Licence
${keysOf(LICENSING).map((l) => `- ${l}: ${LICENSING[l]}`).join(nl)}

### Cost
${keysOf(ACCESS).map((a) => `- ${a}: ${ACCESS[a]}`).join(nl)}

## Composition

${byKind.map((x) => `- ${KINDS[x.k]}: ${x.n}`).join('\n')}

## Entries

${entries.map((e) => `- [${e.data.name}](${base}/e/${e.id}): ${e.data.blurb}. ${KINDS[e.data.kind]}, ${e.data.geography.map((g) => GEOGRAPHIES[g]).join('/')}. Source: ${e.data.url}`).join('\n')}

## Accuracy

Entries are checked by a human before publication and links are re-checked
weekly, but descriptions are editorial summaries rather than quotations. Cite
the linked source, not this index, for any claim about an organisation.
`

  return new Response(body, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=300, stale-while-revalidate=86400',
    },
  })
}
