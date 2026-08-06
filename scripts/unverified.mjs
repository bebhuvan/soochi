/**
 * Lists entries nobody has checked against their source yet.
 *
 * The seed entries were written from memory — real organisations,
 * plausible descriptions, unverified wording. That distinction belongs
 * somewhere a person will actually see it, not in a README checklist
 * that goes stale the day it is written.
 *
 *   node scripts/unverified.mjs
 *
 * To mark one checked, add `verifiedAt: 2026-08-06` to its frontmatter.
 */

import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const dir = 'src/content/entries'
const files = readdirSync(dir).filter((f) => f.endsWith('.md'))

const rows = files
  .map((f) => {
    const t = readFileSync(join(dir, f), 'utf8')
    const fm = t.slice(0, t.indexOf('\n---', 3))
    const get = (k) => fm.match(new RegExp(`^${k}: (.*)$`, 'm'))?.[1]?.trim().replace(/^["']|["']$/g, '')
    return { file: f, name: get('name') ?? f, url: get('url'), verified: get('verifiedAt') }
  })
  .sort((a, b) => a.name.localeCompare(b.name))

const open = rows.filter((r) => !r.verified)

if (open.length === 0) {
  console.log(`All ${rows.length} entries have been checked against their source.`)
  process.exit(0)
}

console.log(`${open.length} of ${rows.length} entries not yet checked:\n`)
for (const r of open) console.log(`  ${r.name.padEnd(36)} ${r.url ?? ''}`)
console.log(`\nCheck the link resolves, the name is current, and the sentence is`)
console.log(`true and not lifted from their marketing. Then add:\n`)
console.log(`  verifiedAt: ${new Date().toISOString().slice(0, 10)}\n`)
console.log(`Until then each entry page says so, which is the honest default.`)
