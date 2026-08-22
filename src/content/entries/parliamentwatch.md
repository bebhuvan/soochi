---
name: ParliamentWatch
url: https://parliamentcommittee.streamlit.app/
blurb: Search, extract, download and track Indian Parliamentary Committee reports, with optional summaries and publication alerts
kind: tool
orgType: individual
topics: [governance, transparency, public-finance, justice]
geography: [india]
licensing: unknown
access: registration
alternateNames: [Parliament Committee Watch]
sourceUrl: https://sansad.in/
links:
  - label: Source code
    url: https://github.com/pranaykotas/parliamentwatch
  - label: Official Parliament source
    url: https://sansad.in/
  - label: ePARLIB archive
    url: https://eparlib.sansad.in/
retrieval:
  bulkDownload: true
  formats: [PDF, CSV, Markdown]
coverage:
  from: 2004
  updated: daily
added: 2026-08-22
status: live
verifiedAt: 2026-08-22
---

ParliamentWatch gathers reports from all 24 Departmentally Related Standing
Committees and makes them easier to browse by committee, Lok Sabha, date and
report category. It can search titles and extracted PDF text, download English
and Hindi reports, export metadata or text, and send daily alerts when new
reports appear.

AI-generated plain-language summaries are optional and can use a local model or
an external provider. The hosted demo currently requires a Streamlit sign-in
and resets between sessions; researchers can run the application locally for
persistent files and summaries. The public repository does not currently
declare a recognised software licence, so reuse rights should not be assumed
from source availability alone.
