import rss from '@astrojs/rss'
import type { APIContext } from 'astro'
import { getCollection } from 'astro:content'
import { KINDS, TOPICS, GEOGRAPHIES } from '../taxonomy'

/**
 * Newest entries first. A directory's feed is "what did you find that I
 * haven't seen", so this is ordered by when we added it, not by when the
 * organisation was founded — and it links to the entry page rather than
 * straight out, so the item stays readable once the link rots.
 */
export async function GET(context: APIContext) {
  const entries = (await getCollection('entries'))
    .filter((e) => e.data.status !== 'dead')
    .sort((a, b) => b.data.added.getTime() - a.data.added.getTime())
    .slice(0, 50)

  return rss({
    title: 'Soochi',
    description:
      'New organisations, public datasets, tools and archives added to Soochi.',
    site: context.site!,
    trailingSlash: false,
    customData: [
      '<language>en</language>',
      '<docs>https://www.rssboard.org/rss-specification</docs>',
    ].join(''),
    items: entries.map((e) => {
      const d = e.data
      const facets = [
        KINDS[d.kind],
        ...d.topics.map((t) => TOPICS[t]),
        ...d.geography.map((g) => GEOGRAPHIES[g]),
      ]
      return {
        title: d.name,
        link: `/e/${e.id}`,
        pubDate: d.added,
        description: d.blurb,
        categories: facets,
        content:
          `<p>${escapeHtml(d.blurb)}</p>` +
          `<p><strong>${escapeHtml(KINDS[d.kind])}</strong> — ` +
          `${escapeHtml(d.geography.map((g) => GEOGRAPHIES[g]).join(', '))}</p>` +
          `<p><a href="${escapeAttr(d.url)}">${escapeHtml(hostOf(d.url))}</a></p>`,
      }
    }),
  })
}

const hostOf = (u: string) => {
  try {
    return new URL(u).host.replace(/^www\./, '')
  } catch {
    return u
  }
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]!)

const escapeAttr = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!)
