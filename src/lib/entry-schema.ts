/**
 * The entry shape, as a plain Zod object with no Astro imports.
 *
 * This file is the reason the submission tool cannot drift from the site:
 * `src/content.config.ts` wraps it for the build, and the serverless
 * functions import the same object to validate submissions. One schema,
 * two consumers — a field the build rejects is a field the form rejects.
 */

import { z } from 'zod'
import {
  KINDS, ORG_TYPES, TOPICS, GEOGRAPHIES, LICENSING, ACCESS, STATUSES, keysOf,
} from '../taxonomy'

export const entrySchema = z.object({
  name: z.string().min(2).max(70),
  url: z.url(),

  /**
   * One sentence, sixteen words or so. The character cap is the single
   * most important rule in this schema: uniform, concise one-liners are
   * the difference between a scannable index and a wall of source copy.
   */
  blurb: z.string().min(20).max(160),

  kind: z.enum(keysOf(KINDS)),
  orgType: z.enum(keysOf(ORG_TYPES)).optional(),

  topics: z.array(z.enum(keysOf(TOPICS))).min(1).max(4),
  geography: z.array(z.enum(keysOf(GEOGRAPHIES))).min(1),

  /* Two axes, not one. Most free tools are proprietary and some
     open-licensed archives sit behind a login, so folding these together
     made "free" an unreliable filter. */
  licensing: z.enum(keysOf(LICENSING)).optional(),
  access: z.enum(keysOf(ACCESS)).optional(),

  /** SPDX id or plain name — the specific licence, distinct from the
      `licensing` facet above, which is only open/proprietary/unclear. */
  license: z.string().max(60).optional(),
  alternateNames: z.array(z.string()).default([]),
  sourceUrl: z.url().optional(),

  added: z.coerce.date(),
  submittedBy: z.string().max(60).optional(),
  status: z.enum(keysOf(STATUSES)).default('live'),

  founded: z.number().int().min(1800).max(2100).optional(),

  people: z
    .array(
      z.object({
        name: z.string(),
        role: z.string().optional(),
        url: z.url().optional(),
      }),
    )
    .default([]),

  contact: z
    .object({
      email: z.email().optional(),
      phone: z.string().max(40).optional(),
      address: z.string().max(200).optional(),
    })
    .optional(),

  links: z
    .array(z.object({ label: z.string().max(40), url: z.url() }))
    .default([]),

  location: z
    .object({
      city: z.string().max(80).optional(),
      region: z.string().max(80).optional(),
      lat: z.number().min(-90).max(90).optional(),
      lng: z.number().min(-180).max(180).optional(),
    })
    .optional(),

  languages: z.array(z.string().max(12)).default([]),

  /* Named `retrieval`, not `access` — `access` is now the cost facet, and
     two keys of the same name in one object silently collide. */
  retrieval: z
    .object({
      api: z.boolean().optional(),
      /** Where the API is documented. Deliberately separate from `api`:
          plenty of sources have one and document it nowhere, and that
          absence is itself worth recording rather than papering over. */
      apiUrl: z.url().optional(),
      /** Name of the portal the API actually lives on, where that is not
          this entry. Common in Indian official statistics: the body that
          runs the survey is rarely the body that serves it. */
      apiVia: z.string().max(60).optional(),
      bulkDownload: z.boolean().optional(),
      formats: z.array(z.string().max(16)).default([]),
    })
    .optional(),

  coverage: z
    .object({
      from: z.number().int().min(1500).max(2200).optional(),
      to: z.number().int().min(1500).max(2200).optional(),
      updated: z
        .enum(['live', 'daily', 'weekly', 'monthly', 'quarterly', 'annually', 'irregular', 'static'])
        .optional(),
    })
    .optional(),

  /* Who pays. `model` was dropped as redundant — it duplicated orgType,
     which already answers "what kind of body is this". A named list of
     funders is the fact orgType cannot give you. */
  funding: z
    .object({ funders: z.array(z.string().max(80)).default([]) })
    .optional(),

  partOf: z.string().max(80).optional(),
  related: z.array(z.string().max(80)).default([]),
  supersededBy: z.string().max(80).optional(),
  logo: z.string().max(200).optional(),
  verifiedAt: z.coerce.date().optional(),
  maintainerNote: z.string().max(500).optional(),
})

/** What a submitter is allowed to send. Provenance fields are ours. */
export const submissionSchema = entrySchema
  .pick({
    name: true, url: true, blurb: true, kind: true, orgType: true,
    topics: true, geography: true, licensing: true, access: true,
    license: true, alternateNames: true, sourceUrl: true, founded: true,
    people: true, contact: true, links: true, location: true, languages: true,
  })
  .extend({
    submittedBy: z.string().max(60).optional(),
    note: z.string().max(1200).optional(),
  })

export type Submission = z.infer<typeof submissionSchema>

/** kebab-case slug, matching the filenames already in the collection. */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)
}

// JSON strings are valid YAML strings. Quoting every human-entered value is
// simpler and safer than trying to enumerate YAML's implicit scalars and
// punctuation rules (for example `yes`, dates, `: ` and inline comments).
const q = (s: string) => JSON.stringify(s)
const list = (a: string[]) => `[${a.map(q).join(', ')}]`

/** Serialise a validated submission into the entry file the repo stores. */
export function toMarkdown(s: Submission, addedISO: string): string {
  const L: string[] = ['---', `name: ${q(s.name)}`, `url: ${q(s.url)}`, `blurb: ${q(s.blurb)}`, `kind: ${s.kind}`]

  if (s.orgType) L.push(`orgType: ${s.orgType}`)
  if (s.founded) L.push(`founded: ${s.founded}`)
  L.push(`topics: ${list(s.topics)}`)
  L.push(`geography: ${list(s.geography)}`)
  if (s.licensing) L.push(`licensing: ${s.licensing}`)
  if (s.access) L.push(`access: ${s.access}`)
  if (s.languages?.length) L.push(`languages: ${list(s.languages)}`)
  if (s.license) L.push(`license: ${q(s.license)}`)
  if (s.alternateNames?.length) L.push(`alternateNames: ${list(s.alternateNames)}`)
  if (s.sourceUrl) L.push(`sourceUrl: ${q(s.sourceUrl)}`)

  if (s.people?.length) {
    L.push('people:')
    for (const p of s.people) {
      L.push(`  - name: ${q(p.name)}`)
      if (p.role) L.push(`    role: ${q(p.role)}`)
      if (p.url) L.push(`    url: ${q(p.url)}`)
    }
  }

  if (s.links?.length) {
    L.push('links:')
    for (const l of s.links) {
      L.push(`  - label: ${q(l.label)}`)
      L.push(`    url: ${q(l.url)}`)
    }
  }

  if (s.contact && Object.values(s.contact).some(Boolean)) {
    L.push('contact:')
    if (s.contact.email) L.push(`  email: ${q(s.contact.email)}`)
    if (s.contact.phone) L.push(`  phone: ${q(s.contact.phone)}`)
    if (s.contact.address) L.push(`  address: ${q(s.contact.address)}`)
  }

  if (s.location && Object.values(s.location).some((v) => v !== undefined)) {
    L.push('location:')
    if (s.location.city) L.push(`  city: ${q(s.location.city)}`)
    if (s.location.region) L.push(`  region: ${q(s.location.region)}`)
    if (s.location.lat !== undefined) L.push(`  lat: ${s.location.lat}`)
    if (s.location.lng !== undefined) L.push(`  lng: ${s.location.lng}`)
  }

  if (s.submittedBy) L.push(`submittedBy: ${q(s.submittedBy)}`)
  L.push(`added: ${addedISO.slice(0, 10)}`)
  L.push('status: live')
  L.push('---')

  if (s.note?.trim()) L.push('', s.note.trim(), '')
  return L.join('\n')
}
