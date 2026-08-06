/**
 * Turns a "Suggest an entry" issue into an entry file.
 *
 * GitHub issue forms render as `### Field label` followed by the answer, so
 * parsing is a matter of splitting on the headings. Anything the submitter
 * got wrong is reported back on the issue rather than silently dropped —
 * the point is that a non-technical contributor gets a useful reply.
 *
 * Usage: node scripts/issue-to-entry.mjs <issue-body-file> <out-dir>
 * Prints the created path on stdout, or `ERROR: …` lines and exits 1.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { submissionSchema, slugify, toMarkdown } from '../src/lib/entry-schema.ts'

const [, , bodyPath, outDir = 'src/content/entries'] = process.argv
const body = readFileSync(bodyPath, 'utf8').replace(/\r\n/g, '\n')

/** Split the issue body into { heading: answer }. */
function parseIssueForm(text) {
  const out = {}
  const parts = text.split(/^### +/m).slice(1)
  for (const part of parts) {
    const nl = part.indexOf('\n')
    const heading = part.slice(0, nl === -1 ? undefined : nl).trim()
    const value = (nl === -1 ? '' : part.slice(nl + 1)).trim()
    out[heading] = value === '_No response_' ? '' : value
  }
  return out
}

const f = parseIssueForm(body)
const errors = []

const get = (label) => (f[label] ?? '').trim()
const list = (label) =>
  get(label)
    .split(/[,\n]/)
    .map((s) => s.trim().toLowerCase().replace(/^[-*]\s*/, ''))
    .filter(Boolean)

const name = get('Name')
const url = get('Link')
const blurb = get('One sentence').replace(/\s+/g, ' ').replace(/\.$/, '')
const kind = get('Kind').toLowerCase()
const orgType = get('Who runs it').toLowerCase()
const topics = list('Topics')
const geography = list('Where')
const licensing = get('Licence').toLowerCase()
const access = get('Cost').toLowerCase()
const alternateNames = get('Also known as').split(',').map((s) => s.trim()).filter(Boolean)
const submittedBy = get('Credit')
const note = get('Anything else')

const candidate = {
  name,
  url,
  blurb,
  kind,
  ...(orgType && orgType !== 'not sure' ? { orgType } : {}),
  topics,
  geography,
  ...(licensing && licensing !== 'not sure' ? { licensing } : {}),
  ...(access && access !== 'not sure' ? { access } : {}),
  alternateNames,
  ...(submittedBy ? { submittedBy } : {}),
  ...(note ? { note } : {}),
}

const parsed = submissionSchema.safeParse(candidate)
if (!parsed.success) {
  for (const issue of parsed.error.issues) {
    const field = issue.path.join('.') || 'entry'
    errors.push(`${field}: ${issue.message}`)
  }
}

if (errors.length) {
  for (const e of errors) console.log(`ERROR: ${e}`)
  process.exit(1)
}

const slug = slugify(name)

if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true })
const file = join(outDir, `${slug}.md`)
if (existsSync(file)) {
  console.log(`ERROR: \`${slug}.md\` already exists — this may already be in the index.`)
  process.exit(1)
}

// Dates come from the workflow, not from the script, so runs are reproducible.
const today = (process.env.ENTRY_DATE || new Date().toISOString()).slice(0, 10)

writeFileSync(file, toMarkdown(parsed.data, today))
console.log(file)
