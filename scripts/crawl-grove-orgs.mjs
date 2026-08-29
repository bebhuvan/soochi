#!/usr/bin/env node
/**
 * Crawl grove.rainmatter.org and build a candidate list of organisations.
 * This deliberately does not write Soochi entries directly — it only outputs
 * evidence-backed candidates for manual review.
 *
 * Default behavior:
 * - Crawl top topic listings per category for a limited number of pages.
 * - Collect candidate names from topic titles, recent user names, and linked
 *   domains in topic content.
 * - Optionally fetch topic pages for richer extraction.
 */

import { mkdirSync, writeFileSync } from 'node:fs'
import { readdirSync, readFileSync, existsSync } from 'node:fs'
import path from 'node:path'

const args = new Map(process.argv.slice(2).map((arg, i, all) => [arg, all[i + 1]]))
const BASE_URL = args.get('--base') || 'https://grove.rainmatter.org'
const MAX_PAGES_PER_CAT = Number(args.get('--pages') || 2)
const MAX_TOPICS_TO_FETCH = Number(args.get('--fetch-limit') || 120)
const INCLUDE_TOPIC_DETAIL = args.has('--include-topic-detail')
const OUT_CSV = args.get('--out-csv') || 'tmp/grove-org-candidates.csv'
const OUT_JSON = args.get('--out-json') || 'tmp/grove-org-candidates.json'
const REQUEST_DELAY_MS = Number(args.get('--delay-ms') || 120)
const MIN_CONFIDENCE = Number(args.get('--min-confidence') || 0)
const MIN_EVIDENCE = Number(args.get('--min-evidence') || 0)
const REQUIRE_EXTERNAL = args.has('--require-external')
const DEBUG = args.has('--debug')

const BASE_HOST = new URL(BASE_URL).hostname
const SKIP_HOST_SUFFIXES = new Set([
  BASE_HOST,
  'grove.rainmatter.org',
  'groveassets.rainmatter.org',
  'www.groveassets.rainmatter.org',
  'shorturl.at',
  'tinyurl.com',
  'bit.ly',
  'mail.google.com',
  'docs.google.com',
  'drive.google.com',
  'goo.gl',
  'cwslnk.co',
  'flodesk.com',
  'view.flodesk.com',
  'discourse-cdn.com',
  'maps.google.com',
  'www.google.com',
  'www.youtube.com',
  'youtube.com',
  'www.linkedin.com',
  'twitter.com',
  'x.com',
  'youtu.be',
  'www.instagram.com',
  'www.facebook.com',
  'www.reddit.com',
  'github.com',
  'forms.gle',
  'zoom.us',
  'forms.office.com',
  'drive.google.com',
  'docs.google.com',
])

const ORG_SUFFIX = /\b(Foundation|Trust|Forum|Institute|Initiative|Alliance|Coalition|Collective|Association|Centre|Center|Laboratory|Lab|Labs|Network|Consortium|Company|Corporation|Co\.?|Inc\.?|LLC|Society|University|College|School|Service|Platform|Group|Movement|Council|Commission|Authority|Board|Foundation|Studio|Studio|Resources?|Consortium|Fellowship|Foundation)\b/i
const GENERIC_NOISE = /\b(updates?|community|announcement|highlights?|news|webinar|spotlight|framework|announcing|photo[-\s]?essay|event|agenda|workshop|perspective|reports?|updates)\b/i
const ORG_KEYWORDS = /\b(climate|environment|energy|water|urban|governance|finance|lab|seed|grants?|tools?|jobs?|policy|law|waste|farming|soil|livelihood|restoration|circular|ecology)\b/i
const PERSON_ROLE_NOISE = /\b(advisor|chair|director|chief|commissioner|officer|secretary|president|founder|co-founder|head|coord|coordinator|editor|member|senior|junior|principal|professor|hon'ble|honble|cm|mla|minister|governor|deputy)\b/i

function looksLikeUrlLikeText(value) {
  return /(?:^|\s)(https?:\/\/|www\.|\b[\w.-]+\.(com|org|in|io|gov|edu|net|co|ai|app|org.in|ac.in)\b)/i.test(value)
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function normalizeString(value) {
  return (value || '')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
}

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
}

function stripHtml(value) {
  return decodeHtml((value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim())
}

function isLikelyPersonName(value) {
  const v = normalizeString(value)
  if (!v) return false
  if (!/\s/.test(v)) return false
  if (v.length > 40) return false
  const parts = v.split(' ')
  if (parts.length < 2 || parts.length > 4) return false
  return parts.every((p, idx) => {
    if (!p) return false
    if (idx === 0 && /^[A-Z]\.?$/.test(p)) return true
    return /^[A-Z][a-z.'-]+$/.test(p)
  })
}

function looksLikeOrg(value) {
  const v = normalizeString(value)
  if (!v || v.length < 3 || v.length > 120) return false
  if (/^\d+$/.test(v)) return false
  if (GENERIC_NOISE.test(v)) return false
  const compact = v.replace(/[^A-Za-z0-9]/g, '')
  if (/^[A-Z]{3,8}$/.test(compact)) return true
  return ORG_SUFFIX.test(v) || ORG_KEYWORDS.test(v) || /[A-Z][a-z]+\s+[A-Z][a-z]+/.test(v)
}

function isCandidateTextNoise(value) {
  const v = normalizeString(value).toLowerCase()
  if (!v) return true
  if (v.length < 3) return true
  if (v.length > 120) return true
  if (GENERIC_NOISE.test(v)) return true
  if (/^(click|visit|view|read|here|learn|watch|follow|open|download|apply|sign|register|submit|explore|viewing|share|subscribe|subscribe now|see|link|website|more)/.test(v)) return true
  if (/^(click\s+here|read\s+more|click\s+to|click\s+for|see\s+the)/.test(v)) return true
  if (PERSON_ROLE_NOISE.test(v)) return true
  if (looksLikeUrlLikeText(v)) return true
  if (/^[^a-zA-Z]*$/.test(v)) return true
  return false
}

function domainToCandidate(host) {
  const cleaned = host.replace(/^www\./, '')
  if (cleaned.includes('grove.rainmatter.org')) return null
  const withoutTld = cleaned.replace(/\.[a-z0-9-]{2,}$/i, '')
  if (!withoutTld || withoutTld.length < 3) return null
  return withoutTld
    .replace(/[.-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function candidateKey(value) {
  return normalizeString(value).toLowerCase()
}

function addCandidate(map, value, source, evidence, link, score = 1) {
  const norm = normalizeString(value)
  if (!norm) return
  const key = candidateKey(norm)
  const prev = map.get(key) || {
    candidate: norm,
    sourceCount: 0,
    maxConfidence: score,
    evidenceTypes: [],
    evidenceLinks: new Set(),
    sourceKinds: new Set(),
  }
  prev.sourceCount += 1
  prev.maxConfidence = Math.max(prev.maxConfidence, score)
  prev.evidenceTypes.push(evidence)
  prev.sourceKinds.add(source)
  prev.evidenceLinks.add(link)
  prev.candidate = prev.candidate.length < norm.length ? prev.candidate : norm
  map.set(key, prev)
}

function parseTopicList(json) {
  const topics = json?.topic_list?.topics || []
  const users = json?.users || []
  return { topics, users }
}

async function fetchJSON(url) {
  const maxAttempts = 4
  let attempt = 0
  while (true) {
    const res = await fetch(url, {
      headers: {
        'user-agent': 'soochi-org-crawler/1.0 (+https://github.com/bebhuvan/soochi)',
        accept: 'application/json',
      },
    })
    if (res.status === 429) {
      if (attempt >= maxAttempts - 1) {
        throw new Error(`Failed ${url} => ${res.status}`)
      }
      const wait = 1500 * Math.pow(2, attempt)
      await sleep(wait)
      attempt += 1
      continue
    }
    if (!res.ok) {
      throw new Error(`Failed ${url} => ${res.status}`)
    }
    return res.json()
  }
}

function extractFromTitle(topicTitle) {
  const title = normalizeString(topicTitle)
  if (!title) return null
  const clean = title
    .replace(/^\s*\[[^\]]+\]\s*:\s*/, '')
    .replace(/\s*[|–—-]\s*(updates?|announced?|announcement|perspective|update|webinar|forum|discussion|announcement)$/i, '')

  const candidate = clean.replace(/\s{2,}/g, ' ')
  return candidate.length > 3 ? candidate : null
}

function extractFromLinkText(text, url, map) {
  const linkText = normalizeString(stripHtml(text))
  if (!linkText) return
  if (
    !isLikelyPersonName(linkText)
    && !isCandidateTextNoise(linkText)
    && linkText.length >= 4
    && looksLikeOrg(linkText)
  ) {
    addCandidate(map, linkText, 'topic-post', 'link text', url, 3)
  }
}

function parseHtmlLinks(html, sourceUrl, map) {
  const re = /<a\b[^>]*\bhref\s*=\s*["']([^"']+)["'][^>]*>(.*?)<\/a>/gis
  let match
  while ((match = re.exec(html))) {
    const href = match[1]
    const text = match[2]
    try {
      const parsed = new URL(href, BASE_URL)
      const host = parsed.hostname.toLowerCase()
      if (!['http:', 'https:'].includes(parsed.protocol)) continue
      if (SKIP_HOST_SUFFIXES.has(host) || host.endsWith('.discourse-cdn.com') || host.endsWith('.discourse.org')) {
        continue
      }
      if (host.includes('discourse'))
        continue

      const hostCandidate = domainToCandidate(host)
      if (hostCandidate && hostCandidate.length > 2) {
        const score = looksLikeOrg(hostCandidate) ? 2 : 1
        addCandidate(map, hostCandidate, 'topic-post', 'external domain', parsed.href, score)
      }
      extractFromLinkText(text, parsed.href, map)
    } catch {
      // ignore invalid links
    }
  }
}

function addUrlVariants(rawHost, set) {
  const host = rawHost.replace(/^www\./, '').toLowerCase()
  set.add(host)

  const labels = host.split('.')
  if (labels.length <= 1) {
    set.add(labels[0])
    return
  }

  const isSecondLevelTld = labels[labels.length - 2]?.length <= 3 && ['com', 'org', 'gov', 'edu', 'net', 'co', 'io', 'ai', 'app'].includes(labels[labels.length - 1])
  const stemStart = isSecondLevelTld && labels.length > 2 ? 0 : 0
  const stem = isSecondLevelTld && labels.length >= 3
    ? labels.slice(0, -2).join('.')
    : labels.slice(0, -1).join('.')

  if (stem) {
    set.add(stem)
    set.add(stem.replace(/[-_\\.]/g, ''))
    set.add(stem.replace(/[^a-z0-9]+/g, ''))
  }

  const leaf = labels[0]
  if (leaf) {
    set.add(leaf)
    set.add(leaf.replace(/[^a-z0-9]+/g, ''))
  }
}

function loadExistingEntries() {
  const entryDir = path.join(process.cwd(), 'src/content/entries')
  const names = new Set()
  const urls = new Set()

  for (const file of readdirSync(entryDir)) {
    if (!file.endsWith('.md')) continue
    const txt = readFileSync(path.join(entryDir, file), 'utf8')
    const front = txt.split('---')[1]
    if (!front) continue
    const nameMatch = front.match(/^name:\s*(.+)$/m)
    const urlMatch = front.match(/^url:\s*(.+)$/m)
    if (nameMatch) {
      const value = normalizeString(nameMatch[1].replace(/^"|"$/g, ''))
      if (value) names.add(candidateKey(value))
    }
    if (urlMatch) {
      const value = normalizeString(urlMatch[1].replace(/^"|"$/g, ''))
      if (value) {
        try {
          addUrlVariants(new URL(value).hostname, urls)
        } catch {
          urls.add(value.toLowerCase())
        }
      }
    }
  }
  return { names, urls }
}

async function main() {
  console.log(`Crawling ${BASE_URL}`)
  const candidates = new Map()
  const seenTopicIds = new Set()
  let topicDetailsFetched = 0
  const existing = loadExistingEntries()

  const categoriesJSON = await fetchJSON(`${BASE_URL}/categories.json`)
  const categories = categoriesJSON?.category_list?.categories || []
  const includeCategories = categories.filter((c) => Number(c.topics ?? c.topics_all_time ?? 0) > 0 && c.id)
  if (DEBUG) {
    console.log(`Categories discovered: ${categories.length}; processing: ${includeCategories.length}`)
  }

  // Seed candidates from forum members on category pages and topic titles.
  for (const cat of includeCategories) {
    const slug = cat.slug
    let page = 0
    while (page < MAX_PAGES_PER_CAT) {
      const url = `${BASE_URL}/c/${slug}/l/latest.json?page=${page}&no_definitions=true`
      let payload = null
      try {
        payload = await fetchJSON(url)
      } catch (error) {
        console.warn(`WARN: ${error.message}`)
        break
      }
      const { topics, users } = parseTopicList(payload)
      if (DEBUG) {
        console.log(`  [${slug}] page ${page}: topics ${topics.length}, users ${users.length}`)
      }
      if (!topics.length) break

      for (const user of users || []) {
        if (user?.name && user.name.length > 2 && !GENERIC_NOISE.test(user.name) && !isLikelyPersonName(user.name)) {
          if (looksLikeOrg(user.name)) {
            addCandidate(candidates, user.name, `category:${slug}`, 'user name', `${BASE_URL}/c/${slug}/l/latest.json?page=${page}`, 2)
          }
        }
      }

      for (const topic of topics) {
        if (!topic?.id) continue
        if (seenTopicIds.has(topic.id)) continue
        seenTopicIds.add(topic.id)

        const topicTitle = extractFromTitle(topic.title || topic.fancy_title || '')
        if (topicTitle && topicTitle.length > 2 && !GENERIC_NOISE.test(topicTitle) && !isLikelyPersonName(topicTitle)) {
          if (looksLikeOrg(topicTitle)) {
            addCandidate(candidates, topicTitle, `category:${slug}`, 'topic title', `${BASE_URL}/t/${topic.slug}/${topic.id}`, 1)
          }
        }

        if (INCLUDE_TOPIC_DETAIL && topicDetailsFetched < MAX_TOPICS_TO_FETCH) {
          // Lightweight detail fetch for richer extraction.
          const topicUrl = `${BASE_URL}/t/${topic.slug}/${topic.id}.json`
          try {
            const topicJSON = await fetchJSON(topicUrl)
            const posts = topicJSON?.post_stream?.posts || []
            for (const p of posts) {
              if (p?.name && p.name.length > 2 && !isLikelyPersonName(p.name)) {
                if (looksLikeOrg(p.name)) {
                  addCandidate(candidates, p.name, `topic:${topic.id}`, 'post name', `${BASE_URL}/t/${topic.id}`, 2)
                }
              }
              if (p?.username && p.username.length > 2 && !isLikelyPersonName(p.username)) {
                if (looksLikeOrg(p.username)) {
                  addCandidate(candidates, p.username, `topic:${topic.id}`, 'post username', `${BASE_URL}/t/${topic.id}`, 1)
                }
              }
              if (p?.cooked) {
                parseHtmlLinks(p.cooked, `${BASE_URL}/t/${topic.id}`, candidates)
              }
            }
            topicDetailsFetched += 1
          } catch (error) {
            // keep crawl resilient; skip topic on errors.
            console.warn(`WARN: could not fetch topic ${topic.id}: ${error.message}`)
          }
          await sleep(REQUEST_DELAY_MS)
        }
      }

      if (REQUEST_DELAY_MS > 0) await sleep(REQUEST_DELAY_MS)
      if (topics.length < 30) break
      page += 1
    }
  }

  const ranked = [...candidates.values()]
    .map((c) => ({
      candidate: c.candidate,
      evidence_count: c.sourceCount,
      max_confidence: c.maxConfidence,
      evidence_types: [...new Set(c.evidenceTypes)].join('|'),
      sources: [...c.sourceKinds],
      source_links: [...c.evidenceLinks].slice(0, 4).join('|'),
    }))
    .filter(({ candidate }) => {
      const key = candidateKey(candidate)
      const isInIndexName = existing.names.has(key)
      const noSpaceKey = key.replace(/\s+/g, '')
      const noPuncKey = key.replace(/[^a-z0-9]+/g, '')
      const isInIndexUrl = existing.urls.has(key)
        || existing.urls.has(noSpaceKey)
        || existing.urls.has(noPuncKey)
        || existing.urls.has(key.replace(/\\./g, ''))
      return !isInIndexName && !isInIndexUrl
    })
    .filter(({ max_confidence, evidence_count }) => max_confidence >= MIN_CONFIDENCE && evidence_count >= MIN_EVIDENCE)
    .filter(({ evidence_types }) => {
      if (!REQUIRE_EXTERNAL) return true
      return evidence_types.includes('external domain')
    })

  ranked.sort((a, b) => {
    if (b.max_confidence !== a.max_confidence) return b.max_confidence - a.max_confidence
    if (b.evidence_count !== a.evidence_count) return b.evidence_count - a.evidence_count
    return a.candidate.localeCompare(b.candidate)
  })

  // Output files for review.
  const outDir = path.dirname(OUT_CSV)
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true })

  const header = 'candidate,evidence_count,max_confidence,evidence_types,sources,source_links\n'
  const rows = ranked
    .map((r) => {
      const c = `"${r.candidate.replace(/"/g, '""')}"`
      const e = String(r.evidence_count)
      const conf = String(r.max_confidence)
      const et = `"${r.evidence_types.replace(/"/g, '""')}"`
      const src = `"${r.sources.join(', ').replace(/"/g, '""')}"`
      const links = `"${r.source_links.replace(/"/g, '""')}"`
      return `${c},${e},${conf},${et},${src},${links}`
    })
    .join('\n')

  writeFileSync(OUT_CSV, header + rows + (rows ? '\n' : ''))
  writeFileSync(OUT_JSON, JSON.stringify(ranked, null, 2))

  if (DEBUG) {
    console.log(`Raw candidates before duplicate filtering: ${candidates.size}`)
    const preview = [...candidates.values()].slice(0, 10)
    for (const item of preview) {
      console.log(`- ${item.candidate} [${item.sourceCount}/${item.maxConfidence}] from ${[...item.sourceKinds][0]}`)
    }
  }

  console.log(`Collected ${ranked.length} candidate organisations`)
  console.log(`Wrote:\n- ${OUT_CSV}\n- ${OUT_JSON}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
