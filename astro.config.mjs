// @ts-check
import { defineConfig } from 'astro/config'
import sitemap, { ChangeFreqEnum } from '@astrojs/sitemap'

const SITE = 'https://soochi.fyi'

export default defineConfig({
  site: SITE,
  trailingSlash: 'never',
  build: { format: 'directory', inlineStylesheets: 'always' },
  compressHTML: true,
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
      serialize(item) {
        // The index changes whenever an entry lands; the editorial pages
        // almost never do. Saying so keeps crawlers off the quiet ones.
        if (item.url === `${SITE}/`) {
          return { ...item, changefreq: ChangeFreqEnum.WEEKLY, priority: 1.0 }
        }
        if (item.url.includes('/e/')) {
          return { ...item, changefreq: ChangeFreqEnum.MONTHLY, priority: 0.8 }
        }
        return { ...item, changefreq: ChangeFreqEnum.YEARLY, priority: 0.5 }
      },
    }),
  ],
})
