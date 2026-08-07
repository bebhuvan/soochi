# Soochi

**Good civic work is badly indexed.**

The dataset you need may already exist. So may the organisation that has spent
years understanding the problem, the tool that would save a month of work, or
the archive preserving records everyone assumes were lost. Finding them still
depends too often on knowing someone who already knows.

[Soochi](https://soochi.fyi) is an attempt to write that knowledge down: a
carefully edited index of civic organisations, datasets, tools, publications,
archives and communities, with particular depth in India.

[Browse the index](https://soochi.fyi) ·
[Use the JSON data](https://soochi.fyi/index.json) ·
[Suggest an entry](https://soochi.fyi/submit) ·
[Read the contribution guide](CONTRIBUTING.md)

## What makes it an index

Soochi is deliberately not a scraped catalogue of links. Every entry is a small,
reviewable text file with a human-written description, a controlled vocabulary
and visible uncertainty.

- **One sentence has to earn the click.** Blurbs are capped at 160 characters,
  written for a colleague rather than copied from marketing material.
- **The vocabulary stays small.** Kinds, topics and geographies come from fixed
  lists. A new term is a schema decision, not an improvised tag.
- **Unknown is a valid answer.** Unclear licensing is labelled unclear. Broken
  organisations become dormant or dead instead of disappearing from history.
- **Projects and parents stay distinct.** A useful dataset can be listed beside
  the organisation that maintains it without pretending they are the same thing.
- **The data is the product.** The website is one presentation of a collection
  designed to remain useful if the framework, host or maintainer changes.

The inclusion bar is usefulness: could a stranger use this to understand or act
on a public problem without needing an introduction? Consultancies selling into
the sector, promotional catalogues and inaccessible work generally do not clear
that bar.

## Use the data

The complete index is published under CC BY 4.0 as CORS-enabled JSON:

```sh
curl https://soochi.fyi/index.json
```

Each record includes a stable ID and the editorial fields available for that
entry. Optional fields are omitted rather than filled with guesses. Three other
generated surfaces serve different readers:

| Surface | Purpose |
|---|---|
| [`index.json`](https://soochi.fyi/index.json) | Canonical machine-readable collection |
| [`rss.xml`](https://soochi.fyi/rss.xml) | The newest additions |
| [`llms.txt`](https://soochi.fyi/llms.txt) | Vocabulary and compact entry map for language models |
| [`sitemap-index.xml`](https://soochi.fyi/sitemap-index.xml) | Every public page for crawlers |

Models and downstream applications should cite the linked primary source, not
Soochi's summary. The summaries are editorial directions into the work, not a
replacement for it.

## Contribute

There are three useful contributions: add something missing, correct something
wrong, or confirm that an uncertain entry is still alive.

- The [site form](https://soochi.fyi/submit) needs no GitHub account. It validates
  a proposal and opens a pull request; it never publishes directly.
- GitHub users can open a [new-entry issue](https://github.com/bebhuvan/soochi/issues/new?template=new-entry.yml)
  or a [correction](https://github.com/bebhuvan/soochi/issues/new?template=correction.yml).
- Contributors comfortable with Git can add or edit a Markdown file and open a
  pull request.

The form's optional enrichment step creates a draft, not a verdict. A person can
edit it, the shared schema validates it and a maintainer still reviews the diff.
See [CONTRIBUTING.md](CONTRIBUTING.md) for the editorial rules and a minimal
entry example.

## Work on the site

Soochi uses Astro for static pages and Cloudflare Workers for the two submission
endpoints. There is no application database: entries live in Git and the public
site is generated from them.

```sh
npm install
npm run dev             # Astro development server
npm run check           # content, Astro and TypeScript diagnostics
npm run build           # static site plus Worker bundle
npm run preview:worker  # production-like local Worker
```

The main pieces are intentionally ordinary:

| Path | Responsibility |
|---|---|
| `src/content/entries/*.md` | One source-controlled file per entry |
| `src/lib/entry-schema.ts` | Shared Zod schema for builds and submissions |
| `src/taxonomy.ts` | Controlled kinds, topics, places and status values |
| `src/pages/index.astro` | Searchable, faceted index |
| `src/pages/e/[id].astro` | Entry detail pages and structured data |
| `src/pages/index.json.ts` | Generated public dataset |
| `functions/api/*.ts` | Draft enrichment and pull-request submission |
| `public/_headers` | Security, caching and CORS policy |

The schema is shared by the static build and Worker. A field rejected by the
site is rejected by the submission endpoint too; there is no parallel validation
model to drift.

## Submission security

The public form can propose repository writes, so its boundaries are intentionally
narrow:

- Cloudflare Turnstile is mandatory and fails closed when misconfigured.
- Native per-IP rate limits protect both Worker endpoints.
- The GitHub credential is scoped to this repository and opens a branch and pull
  request; it cannot merge.
- Structured model output is constrained by the same enums as the content
  collection, and uncertain fields may be omitted.

For local Worker development, copy `.dev.vars.example` to `.dev.vars` and add
development credentials. Never commit that file. Production requires encrypted
`ANTHROPIC_API_KEY`, `GITHUB_TOKEN` and `TURNSTILE_SECRET` secrets; repository and
branch names are configured in `wrangler.jsonc`. A Turnstile site key can be
provided at build time as `PUBLIC_TURNSTILE_SITE_KEY`.

## Deployment and upkeep

`npm run deploy` runs diagnostics, builds the static assets and Worker, and
publishes both through Wrangler. Production uses the custom domains
`soochi.fyi` and `www.soochi.fyi`.

CI validates every change. A scheduled link check reports URLs that stop
resolving, while entries are marked `dormant` or `dead` through editorial review
rather than automatically erased. Dependabot keeps the small dependency set
current.

The site favours static HTML, route-scoped JavaScript and simple browser-side
filtering. The map alone loads Leaflet; ordinary entry and editorial pages ship
no client framework.

## Licence

The entries and generated dataset are licensed under
[Creative Commons Attribution 4.0 International](LICENSE). Reuse and adaptation,
including commercial use, are welcome with appropriate credit, a licence link and
an indication of changes. The site code is available under the MIT licence in the
same file. Contributions are made on that basis, with authorship retained in Git
history. Linked resources keep their own licences.

Soochi means an index. The ambition is modest: make worthwhile work a little
less dependent on already knowing where to look.
