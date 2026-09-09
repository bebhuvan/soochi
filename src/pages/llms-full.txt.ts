import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'
import { KINDS, TOPICS, GEOGRAPHIES, LICENSING, ACCESS } from '../taxonomy'

/**
 * /llms-full.txt — Complete comprehensive context for language models.
 * Contains detailed metadata, descriptions, and links for every live entry.
 */
export const GET: APIRoute = async ({ site }) => {
  const base = site?.toString().replace(/\/$/, '') ?? ''
  const all = await getCollection('entries')
  const live = all.filter((e) => e.data.status !== 'dead')

  const updated = live.reduce<Date | null>(
    (latest, e) => (!latest || e.data.added > latest ? e.data.added : latest),
    null,
  )

  const entries = [...live].sort((a, b) =>
    a.data.name.localeCompare(b.data.name, 'en', { sensitivity: 'base' }),
  )

  const lines: string[] = [
    '# Soochi — Full Catalog',
    '',
    `> Complete catalog of ${live.length} civic data sources, tools, organisations and research for public-interest work, updated ${updated ? updated.toISOString().slice(0, 10) : 'regularly'}. Licensed under CC BY 4.0.`,
    '',
    `Canonical dataset: ${base}/index.json`,
    `Short overview: ${base}/llms.txt`,
    '',
    '## Catalog Entries',
    '',
  ]

  for (const e of entries) {
    const d = e.data
    lines.push(`### ${d.name}`)
    lines.push(`- **Entry Page**: ${base}/e/${e.id}`)
    lines.push(`- **Source URL**: ${d.url}`)
    lines.push(`- **Kind**: ${KINDS[d.kind]}`)
    lines.push(`- **Topics**: ${d.topics.map((t) => TOPICS[t]).join(', ')}`)
    lines.push(`- **Geography**: ${d.geography.map((g) => GEOGRAPHIES[g]).join(', ')}`)
    if (d.licensing) lines.push(`- **Licence**: ${LICENSING[d.licensing]}${d.license ? ` (${d.license})` : ''}`)
    if (d.access) lines.push(`- **Cost**: ${ACCESS[d.access]}`)
    if (d.founded) lines.push(`- **Founded**: ${d.founded}`)
    if (d.location?.city) {
      lines.push(`- **Location**: ${[d.location.city, d.location.region].filter(Boolean).join(', ')}`)
    }
    lines.push(`- **Summary**: ${d.blurb}`)
    if (e.body?.trim()) {
      lines.push(`- **Notes**: ${e.body.trim().replace(/\n+/g, ' ')}`)
    }
    lines.push('')
  }

  return new Response(lines.join('\n'), {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=300, stale-while-revalidate=86400',
    },
  })
}
