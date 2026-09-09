// @ts-check
import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'astro/config'
import sitemap, { ChangeFreqEnum } from '@astrojs/sitemap'

const SITE = 'https://soochi.fyi'

// Scan entry frontmatters to populate accurate lastmod dates in the sitemap.
const entriesDir = './src/content/entries'
/** @type {Map<string, Date>} */
const entryDates = new Map()
/** @type {Map<string, Date>} */
const topicDates = new Map()
/** @type {Map<string, Date>} */
const kindDates = new Map()
/** @type {Date | null} */
let latestSiteDate = null

if (fs.existsSync(entriesDir)) {
  const files = fs.readdirSync(entriesDir).filter((f) => f.endsWith('.md'))
  for (const f of files) {
    const content = fs.readFileSync(path.join(entriesDir, f), 'utf-8')
    const addedMatch = content.match(/^added:\s*['"]?([0-9-]+)/m)
    const verifiedMatch = content.match(/^verifiedAt:\s*['"]?([0-9-]+)/m)
    const kindMatch = content.match(/^kind:\s*['"]?([a-z-]+)/m)
    const topicsMatch = content.match(/^topics:\s*\[(.*?)\]/m)

    const dateStr = verifiedMatch ? verifiedMatch[1] : (addedMatch ? addedMatch[1] : null)
    if (!dateStr) continue

    const date = new Date(dateStr)
    const slug = f.replace(/\.md$/, '')
    entryDates.set(slug, date)

    if (!latestSiteDate || date > latestSiteDate) {
      latestSiteDate = date
    }

    if (kindMatch) {
      const k = kindMatch[1].trim()
      const prev = kindDates.get(k)
      if (!prev || date > prev) kindDates.set(k, date)
    }

    if (topicsMatch) {
      const ts = topicsMatch[1].split(',').map((s) => s.replace(/['"\s]/g, '')).filter(Boolean)
      for (const t of ts) {
        const prev = topicDates.get(t)
        if (!prev || date > prev) topicDates.set(t, date)
      }
    }
  }
}

export default defineConfig({
  site: SITE,
  trailingSlash: 'never',
  build: { format: 'directory', inlineStylesheets: 'always' },
  compressHTML: true,
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
      serialize(item) {
        if (item.url === `${SITE}/` || item.url === SITE) {
          return {
            ...item,
            changefreq: ChangeFreqEnum.WEEKLY,
            priority: 1.0,
            lastmod: latestSiteDate ? latestSiteDate.toISOString() : undefined,
          }
        }
        const entryMatch = item.url.match(/\/e\/([^/]+)$/)
        if (entryMatch) {
          const slug = entryMatch[1]
          const date = entryDates.get(slug)
          return {
            ...item,
            changefreq: ChangeFreqEnum.MONTHLY,
            priority: 0.8,
            lastmod: date ? date.toISOString() : undefined,
          }
        }
        const topicMatch = item.url.match(/\/topics\/([^/]+)$/)
        if (topicMatch) {
          const topic = topicMatch[1]
          const date = topicDates.get(topic)
          return {
            ...item,
            changefreq: ChangeFreqEnum.WEEKLY,
            priority: 0.9,
            lastmod: date ? date.toISOString() : undefined,
          }
        }
        if (item.url.endsWith('/topics')) {
          return {
            ...item,
            changefreq: ChangeFreqEnum.WEEKLY,
            priority: 0.8,
            lastmod: latestSiteDate ? latestSiteDate.toISOString() : undefined,
          }
        }
        const kindMatch = item.url.match(/\/kinds\/([^/]+)$/)
        if (kindMatch) {
          const kind = kindMatch[1]
          const date = kindDates.get(kind)
          return {
            ...item,
            changefreq: ChangeFreqEnum.WEEKLY,
            priority: 0.8,
            lastmod: date ? date.toISOString() : undefined,
          }
        }
        if (item.url.endsWith('/kinds')) {
          return {
            ...item,
            changefreq: ChangeFreqEnum.WEEKLY,
            priority: 0.7,
            lastmod: latestSiteDate ? latestSiteDate.toISOString() : undefined,
          }
        }
        return { ...item, changefreq: ChangeFreqEnum.YEARLY, priority: 0.5 }
      },
    }),
  ],
})
