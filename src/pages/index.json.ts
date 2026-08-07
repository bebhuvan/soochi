import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'

/**
 * The whole index as one file, so the directory is useful to people who
 * never visit the site. Dead entries are included here — the record of
 * what used to exist is part of the value.
 */
export const GET: APIRoute = async () => {
  const entries = await getCollection('entries')

  const body = {
    name: 'Soochi',
    license: 'CC-BY-4.0',
    generated: null as string | null,
    count: entries.length,
    entries: entries
      .map((e) => ({ id: e.id, ...e.data, added: e.data.added.toISOString().slice(0, 10) }))
      .sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' })),
  }

  return new Response(JSON.stringify(body, null, 2), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  })
}
