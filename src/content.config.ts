import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { entrySchema } from './lib/entry-schema'

/**
 * The schema itself lives in `src/lib/entry-schema.ts` so the submission
 * functions can import the same object. If you add a field, add it there
 * — the build and the form then agree by construction.
 */
const entries = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/entries' }),
  schema: entrySchema,
})

export const collections = { entries }
