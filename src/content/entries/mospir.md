---
name: mospiR
url: https://mospir.saketlab.org/
blurb: R client for the MoSPI Microdata Portal that searches and downloads NSS, PLFS, ASI, HCES and other survey unit-level data
kind: tool
orgType: academic
topics: [economy, labour, demography]
geography: [india]
licensing: open
license: MIT
access: free
people:
  - name: Saket Choudhary
    url: https://saketlab.org/
links:
  - label: GitHub
    url: https://github.com/saketlab/mospiR
retrieval:
  api: true
  apiVia: MoSPI Microdata Archive
  bulkDownload: true
partOf: Saket Lab, IIT Bombay
related: [MoSPI Microdata Archive, MoSPI MCP Server, censusindia]
added: 2026-09-28
status: live
verifiedAt: 2026-09-28
---

mospiR is an R package from Saket Lab at IIT Bombay for fetching unit-level survey data from microdata.gov.in, the Ministry of Statistics' microdata portal. It turns downloading through the portal into a few lines of code.

It does four things:
- `list_datasets()` lists every dataset on the portal, with a keyword filter such as "labour force".
- `list_files()` shows the files inside a survey round, with their sizes.
- `download_file()` fetches a single file.
- `download_dataset()` fetches an entire survey round into a folder.

This covers the National Sample Survey rounds, the Periodic Labour Force Survey, the Annual Survey of Industries, the Household Consumption Expenditure Survey and anything else on the portal. Failed requests are retried with exponential backoff.

You still need a free API key from microdata.gov.in, stored in `.Renviron`. The package only downloads the raw files. Reading them is a separate job, and the same lab's nesstarR package parses the older Nesstar-format files that many NSS rounds come in.
