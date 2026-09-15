---
name: India Public Finance Portal
url: https://github.com/xKDR/india-public-finance-portal
blurb: Research-grade Indian state budget data extracted from expenditure PDFs, with source provenance, validation checks, and multi-language worked examples
kind: dataset
orgType: nonprofit
topics: [public-finance, governance, transparency]
geography: [india, karnataka, tamil-nadu]
licensing: open
license: MIT
access: free
alternateNames: [India State Budget Data]
people:
  - name: Ajay Shah
  - name: Susan Thomas
links:
  - label: GitHub Repository
    url: https://github.com/xKDR/india-public-finance-portal
  - label: XKDR Forum
    url: https://xkdr.org/
retrieval:
  bulkDownload: true
  formats: [csv, ndjson, pdf]
coverage:
  from: 2014
  to: 2027
  updated: irregular
partOf: xkdr-forum
related: [cag-state-accounts, rbi-state-finances, public-finance-playground]
added: 2026-09-15
status: live
verifiedAt: 2026-09-15
---

India Public Finance Portal is an open research project by XKDR Forum that extracts and standardizes granular state budget data from official expenditure-volume PDFs into machine-readable CSV and NDJSON formats.

Rather than aggregating or flattening away inconsistencies, the repository retains source document hierarchy, line-item metadata, and row roles so researchers can audit any number back to the original budget page.
- **Current Coverage**: Karnataka state budget expenditure data spanning 9 fiscal years (2018–19 to 2026–27) across 7 annual volumes, and Tamil Nadu budget data covering 13 fiscal years (2014–15 to 2026–27).
- **Auditability & Integrity**: Each state package includes data dictionaries, demand-number-to-department lookup tables, machine-readable validation summaries testing internal summation rules, and cross-year accuracy metrics.
- **Worked Examples Compendium**: Fully reproducible analyses implemented across Python (standard library only), base R, and DuckDB SQL, packaged with a pinned Docker environment for one-command replication.
