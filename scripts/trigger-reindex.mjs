import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const KEY = 'e080d2319ccecd808f63b5b969621703'
const HOST = 'soochi.fyi'
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`

async function main() {
  const sitemapPath = resolve('dist/sitemap-0.xml')
  let urls = []

  if (existsSync(sitemapPath)) {
    const sitemapContent = readFileSync(sitemapPath, 'utf8')
    const matches = [...sitemapContent.matchAll(/<loc>(.*?)<\/loc>/g)]
    urls = matches.map(m => m[1])
  } else {
    console.warn('⚠️  dist/sitemap-0.xml not found. Using root and primary hubs as fallback.')
    urls = [
      `https://${HOST}/`,
      `https://${HOST}/topics`,
      `https://${HOST}/kinds`,
      `https://${HOST}/about`,
      `https://${HOST}/directories`,
      `https://${HOST}/map`,
      `https://${HOST}/contribute`,
      `https://${HOST}/submit`,
      `https://${HOST}/llms.txt`,
      `https://${HOST}/llms-full.txt`
    ]
  }

  console.log(`Found ${urls.length} URLs to submit for reindexing.`)

  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls
  }

  const endpoints = [
    { name: 'IndexNow (api.indexnow.org)', url: 'https://api.indexnow.org/indexnow' },
    { name: 'Bing IndexNow (www.bing.com/indexnow)', url: 'https://www.bing.com/indexnow' }
  ]

  for (const ep of endpoints) {
    try {
      console.log(`📡 Submitting to ${ep.name}...`)
      const res = await fetch(ep.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(payload)
      })

      const text = await res.text()
      if (res.ok || res.status === 200 || res.status === 202) {
        console.log(`✅ [${res.status} ${res.statusText}] Submitted successfully to ${ep.name}`)
      } else {
        console.warn(`⚠️ [${res.status} ${res.statusText}] Response: ${text || '(empty)'}`)
      }
    } catch (err) {
      console.error(`❌ Failed to submit to ${ep.name}:`, err.message)
    }
  }

  console.log('\n--- Search Engine Sitemaps & Discovery ---')
  console.log(`• Sitemap Index: https://${HOST}/sitemap-index.xml`)
  console.log(`• robots.txt: https://${HOST}/robots.txt`)
  console.log(`• Google Search Console: Submit sitemap index directly at https://search.google.com/search-console/sitemaps`)
}

main()
