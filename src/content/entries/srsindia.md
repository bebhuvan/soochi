---
name: srsindia
url: https://srsindia.saketlab.org/
blurb: R package that turns India's Sample Registration System reports into tidy tables of life tables, causes of death and vital rates
kind: tool
orgType: academic
topics: [demography, health]
geography: [india]
licensing: open
license: MIT
access: free
alternateNames: [SRS India R package, BharatPulse]
people:
  - name: Saket Choudhary
    url: https://saketlab.org/
links:
  - label: GitHub
    url: https://github.com/saketlab/srsindia
retrieval:
  bulkDownload: true
coverage:
  from: 1997
  to: 2024
partOf: Saket Lab, IIT Bombay
related: [SRS and Vital Statistics, Census of India, Genome of India]
added: 2026-09-28
status: live
verifiedAt: 2026-09-28
---

srsindia is an R package from Saket Lab at IIT Bombay that makes the Sample Registration System usable as data. The Registrar General publishes SRS mostly as PDF reports and bulletins; this package has extracted those tables and serves them through a few simple functions.

It covers three datasets across 36 states and union territories:
- **Life tables**: abridged life tables by state for 14 rolling five-year periods, from 2007 to 2024 (`get_srs_life_table()`).
- **Causes of death**: national, zonal and state breakdowns from 2007 to 2024 (`get_srs_cod()`).
- **Vital statistics**: birth rates, death rates and infant mortality from SRS bulletins, 1997 to 2024 (`get_srs_bulletin()`).

State names are matched loosely, so small spelling differences do not break a query, and discovery functions list what is available. The package also ships an MCP server, BharatPulse, so AI assistants can query the same tables directly.

It installs with `pak::pak("saketlab/srsindia")`. The code is MIT licensed and the underlying data comes from the Office of the Registrar General under the Government Open Data Licence (GODL-India).
