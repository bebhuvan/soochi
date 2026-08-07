/**
 * Apply rich contextual notes to Soochi entries.
 * Reads the entries directory, matches against notes-data.mjs, and adds body text.
 * node scripts/apply-notes.mjs [--dry]
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { readdir } from 'fs/promises'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { NOTES } from './notes-data.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const entriesDir = resolve(__dirname, '..', 'src', 'content', 'entries')
const dryRun = process.argv.includes('--dry')

const files = await readdir(entriesDir)
let updated = 0, skipped = 0

for (const file of files) {
  if (!file.endsWith('.md')) continue
  const path = resolve(entriesDir, file)
  const content = readFileSync(path, 'utf-8')

  // Extract name from frontmatter
  const nameMatch = content.match(/^name:\s*["']?(.+?)["']?\s*$/m)
  if (!nameMatch) continue
  const name = nameMatch[1]

  // Check if it already has body text
  const parts = content.split('---')
  const hasBody = parts.length > 2 && parts[2].trim().length > 0
  if (hasBody) {
    // Only add notes if the entry has no body OR the note is specifically for improving a thin entry
    // For now, skip entries that already have notes
    skipped++
    continue
  }

  // Find matching note - try by file slug, then by name
  const slug = file.replace('.md', '')
  let note = NOTES[slug] || NOTES[name]
  // Also try cleaning quotes from name
  if (!note) {
    const cleanName = name.replace(/^["']|["']$/g, '')
    note = NOTES[cleanName]
  }

  if (!note) continue

  // Add note as body text
  const newContent = parts[0] + '---' + parts[1] + '---\n\n' + note.trim() + '\n'

  if (dryRun) {
    console.log(`WOULD UPDATE: ${file} (${name})`)
  } else {
    writeFileSync(path, newContent, 'utf-8')
    console.log(`UPDATED: ${file}`)
  }
  updated++
}

console.log(`\nUpdated: ${updated}, Skipped (had body): ${skipped}`)
