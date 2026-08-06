# Soochi

A directory of civic organisations, open datasets, tools, publications and
archives. Static site, no database, no server — every entry is a text file
in this repository.

## Running it

```sh
npm install
npm run dev      # http://localhost:4321
npm run check    # Astro and TypeScript diagnostics
npm run build    # static site -> dist/, Worker -> .worker/
npm run preview:worker  # production-like local Worker
```

## How it is put together

| | |
|---|---|
| `src/content/entries/*.md` | One file per entry. Frontmatter is the data. |
| `src/content.config.ts` | The schema. Enforced at build time — a bad entry fails CI. |
| `src/taxonomy.ts` | The controlled vocabulary. Adding a term is a deliberate edit. |
| `src/pages/index.astro` | The index, its filter rail, and the client-side faceting. |
| `src/pages/index.json.ts` | The whole dataset as one file, CC0. |
| `src/pages/rss.xml.ts` | The 50 newest entries, for people who want to follow additions. |
| `src/pages/llms.txt.ts` | A generated map of the site for language models. |
| `scripts/issue-to-entry.mjs` | Turns a submitted issue form into an entry file. |

The data is meant to outlive the site. If you ever want to move off Astro,
`src/content/entries/` is the product and everything else is presentation.

## Adding an entry

```yaml
---
name: Open Budgets India
url: https://openbudgetsindia.org
blurb: Union, state and municipal budgets as machine-readable data
kind: dataset            # organisation | dataset | tool | publication
                         # dashboard | archive | community
orgType: nonprofit       # optional
topics: [governance, economy]     # 1–4, from taxonomy.ts
geography: [india]                # 1+, from taxonomy.ts
licensing: open                   # optional
access: free                      # optional
added: 2026-08-05
status: live             # live | dormant | dead
---

Anything after the frontmatter is an optional note. See "Known gaps".
```

Two rules do most of the work: `blurb` is capped at 160 characters, and
`topics`/`geography` must come from the fixed vocabulary. Both are enforced
by the schema, so the index cannot drift into tag soup or paragraph-long
descriptions without someone consciously changing the rules.

## The submission tool

`/submit` lets someone add an entry **without a GitHub account or any Git
knowledge**. Two routes on the Cloudflare Worker back it:

| | |
|---|---|
| `POST /api/enrich` | Takes a URL. Claude reads the page (and searches where the page is thin) and returns a **draft** — name, blurb, kind, topics, geography — for the submitter to correct. It writes nothing. |
| `POST /api/submit` | Validates, commits an entry file to a new branch, opens a pull request. Never merges. |

**The schema is shared, not duplicated.** `src/lib/entry-schema.ts` is
plain Zod with no Astro imports; `src/content.config.ts` wraps it for the
build and both functions import it directly. A field the build would
reject is a field the form rejects, by construction — there is no second
copy to drift.

### Setting it up

Deploy with `npm run deploy`, then set these as encrypted Worker secrets
with `npx wrangler secret put NAME` (or in the Cloudflare dashboard):

| Variable | What |
|---|---|
| `ANTHROPIC_API_KEY` | secret — from console.anthropic.com |
| `GITHUB_TOKEN` | secret — fine-grained PAT or GitHub App token, **scoped to this one repo**, with Contents: read+write and Pull requests: read+write. Nothing else. |
| `GITHUB_REPO` | `owner/repo` |
| `GITHUB_BASE_BRANCH` | optional, defaults to `main` |
| `TURNSTILE_SECRET` | secret — from the Turnstile dashboard |
| `PUBLIC_TURNSTILE_SITE_KEY` | optional build-time override for preview/staging; production's public site key is committed in the submission page |

The Worker configuration includes native per-IP limits: four enrichments and
six submissions per minute. Turnstile remains mandatory on both routes.

**Turnstile is not optional.** An open form that writes to a public repo
will be found. `verifyTurnstile` fails **closed** — if the secret is
missing, submissions are refused rather than accepted unchecked.

### What the LLM is and isn't allowed to do

It drafts; a human edits; a maintainer reviews the PR. Three things keep
that honest:

- It is told to **omit** a field rather than guess it — an empty field
  costs a reviewer nothing, an invented one costs trust in every field.
- **Structured outputs** with enums generated from `taxonomy.ts`, so an
  off-vocabulary topic is unrepresentable rather than merely discouraged.
- It returns a **confidence** level and names the fields it's least sure
  of; the form shows both and tells the submitter to check everything.

Thinking stays on for the enrichment call. With it disabled the model can
write a tool call into visible text instead of calling the tool — the
search silently never runs and the draft gets invented instead of read.

## Contributions

Four paths — the form above, plus three in `.github/`:

1. **Issue form** (`ISSUE_TEMPLATE/new-entry.yml`) — a web form needing no
   Git knowledge. The `issue-to-pr` workflow parses it, writes the entry
   file, validates it against the schema, and opens a pull request. If the
   submission has problems the bot comments on the issue explaining what to
   fix rather than failing silently.
2. **Correction form** for dead links and inaccuracies.
3. **Pull request** for anyone comfortable with Git.

Moderation is the actual work here, and it is deliberately a 30-second
diff review rather than a dashboard.

## Upkeep

`link-check.yml` runs lychee every Monday and opens a single issue listing
anything that stopped resolving. Link rot, not code, is what kills
directories. Entries that die are marked `dormant` then `dead` rather than
deleted — they stay in `index.json`, and `dead` ones are hidden from the
site.

## Before the first deploy

- [x] Canonical domain, sitemap, robots and social metadata use `soochi.fyi`
- [x] Worker Static Assets, API routing, headers and rate limits are configured
- [x] The social card and visible identity use Soochi
- [ ] Create or connect `github.com/bebhuvan/soochi`
- [ ] Set the five production variables/secrets listed above
- [ ] Create a Turnstile widget for `soochi.fyi` and build with its public key
- [ ] Verify the entries listed by `npm run unverified`
- [ ] Run `npm run deploy`, then test both submission routes on the real domain

## What ships

| | |
|---|---|
| JS on `/about`, `/e/*` | No framework/runtime; only the small theme control |
| JS on `/` | Small inline filtering and theme controls |
| JS on `/map` | 44 KB gzipped (Leaflet, route-scoped) |
| Fonts | Latin subset only per visit; `unicode-range` handles the rest |
| Pages | 68, all static |

SEO: per-page canonical, Open Graph and Twitter cards with a real
`og.png`, a sitemap with per-section `changefreq`, `robots.txt`, and
JSON-LD — `CollectionPage` + `ItemList` on the index, and a typed
`Organization` / `Dataset` / `SoftwareApplication` plus `BreadcrumbList`
on each entry page.

### Machine-readable surfaces

Four, all generated from the collection so none can drift from it:

| | |
|---|---|
| `/index.json` | The canonical dataset. CC0, CORS-open, every field. |
| `/rss.xml` | The 50 newest entries, ordered by when they were added — a directory's feed is "what did you find that I haven't seen". |
| `/llms.txt` | A map for language models: the vocabulary, the pages, and every entry in one line each. It leads with `index.json`, because for a directory the right answer to "what is here" is the dataset, not a crawl of the HTML. |
| `/sitemap-index.xml` | Every page. |

`llms.txt` ends with an accuracy note telling models to cite the linked
source rather than this index — descriptions here are editorial summaries,
not quotations, and a model reproducing them as fact would be wrong.

Security and caching live in `public/_headers`: a CSP restricted to the
map-tile and Turnstile origins, immutable caching for hashed assets, and
a short cache with CORS on `/index.json` so people can script against it.

## Entry pages

Every entry gets a page at `/e/<id>`. The index row opens it; the small
arrow on the row goes straight to the site for people who only want the
link. The page renders whatever optional fields the entry has —
`people`, `contact`, `links`, `founded`, `location` — plus the prose
after the frontmatter, and shows nothing where there is nothing.

`links` is a labelled list rather than one field per platform, so adding
a YouTube channel, a Mastodon account or an API doc never needs a schema
change.

## Known gaps

- Thirty-eight entries still need a source check. Their pages say so rather
  than presenting unverified summaries as settled fact.
- Client-side filtering is intentionally simple and dependency-free. Replace
  it with a search index only when the collection outgrows one document.

## The map

`/map` plots entries that have `location.lat` / `location.lng`. Leaflet
with CARTO raster tiles over OpenStreetMap data, basemap switching with
the theme, markers tinted by kind.

It shows **where organisations are based, not where their work applies** —
those are different questions and the page says so. Entries with no single
place (OpenStreetMap, a collective) deliberately have no coordinates and
do not appear; the page states how many are missing rather than quietly
showing a partial picture.

Locations are **city-level**, so several Delhi organisations share one
coordinate. Coincident entries become a single marker carrying a count
whose popup lists them all — nudging them apart would invent a precision
the data does not have.

Speed, and why it is contained:

| page | JS shipped (gzipped) |
|---|---|
| `/` | dependency-free inline filtering |
| `/about`, `/e/*` | theme control only |
| `/map` | 44 KB |

Leaflet is bundled per-route, so the map's weight never touches the index.
Leaflet (~44 KB) over MapLibre GL (~200 KB+) because raster tiles need no
WebGL and no vector tile pipeline. Retina tiles are off — four times the
bytes for a basemap this plain. Scroll-zoom only engages after you click
into the map, so the page still scrolls normally past it.

Markers are DOM nodes (`divIcon`), which is fine into the low hundreds.
Past that, add `leaflet.markercluster` rather than switching renderer.

**Tile terms:** CARTO basemaps are free for low volume with attribution,
which is present. At real traffic, self-host tiles (Protomaps `.pmtiles`
is the cheap route) rather than leaning on someone else's CDN.

**Coordinates need checking.** They were written from memory at city
level, like the blurbs. Five entries have none.
