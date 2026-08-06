# Contributing

The index is only as good as the number of people putting things into it.
You do not need to know how the site is built to add to it.

## The quickest route

Open the [entry form](../../issues/new?template=new-entry.yml). It needs a
GitHub account but no Git. A bot converts your answers into a proposed
change, validates it, and opens a pull request. If something does not
validate it comments on your issue explaining what to fix.

Found something wrong instead? [File a
correction](../../issues/new?template=correction.yml). Corrections are
worth as much as additions — an index nobody corrects goes stale quietly.

## By hand

```sh
npm install
npm run dev
```

Add a file to `src/content/entries/<slug>.md`:

```yaml
---
name: Open Budgets India
url: https://openbudgetsindia.org
blurb: Union, state and municipal budgets as machine-readable data
kind: dataset
topics: [governance, economy]
geography: [india]
licensing: open
access: free
added: 2026-08-06
---

Anything here is an optional note, shown on the entry's own page.
```

`npm run build` fails on anything the schema rejects, so CI catches a bad
entry before a human looks at it. The full field list — including the
optional ones like `people`, `contact`, `links`, `languages` and
`funding` — is in `src/content.config.ts`, commented.

## What gets listed

Anything that helps someone understand or act on a public problem and that
a stranger can use without an introduction. The bar is usefulness, not
size or reputation.

Not listed: consultancies and vendors selling into the sector, products
whose free tier is really a trial, anything primarily promotional about
itself, and anything you cannot reach without knowing someone. Paywalled
work is listed when the work itself is the point, and labelled.

## Two rules that do most of the work

**`blurb` is capped at 160 characters.** This is the difference between a
page you can scan and a page of copy somebody else wrote. Write it as if
to a colleague. No trailing full stop, no "A platform that…" preamble.

**`topics` and `geography` come from fixed lists** in `src/taxonomy.ts`.
Adding a term is a deliberate edit that gets reviewed. An index where
every entry invents its own tags is a list, not an index — if nothing
fits, say so rather than inventing one.

## Reviewing

Maintainers: before merging, check the link resolves, the sentence reads
like the others, and the tags are the ones you would have chosen. That is
the whole review. It should take under a minute.

## Licence

Entries are released under CC0 — see [LICENSE](LICENSE). By contributing
you agree to place your contribution in the public domain. You are
credited in the commit history and, if you want, on the entry itself.
