---
name: MoSPI MCP Server
url: https://github.com/nso-india/esankhyiki-mcp
blurb: 27 official Indian statistical datasets, queryable in plain language from an AI assistant rather than through a download page
kind: dataset
orgType: government
topics: [economy, labour, health, technology]
geography: [india]
licensing: open
access: free
license: MIT
alternateNames: [eSankhyiki MCP, MoSPI Model Context Protocol Server, NSO MCP, Data Innovation Lab]
sourceUrl: https://mcp.mospi.gov.in/
added: 2026-08-06
status: live
verifiedAt: 2026-08-06
retrieval:
  api: true
  apiUrl: https://github.com/nso-india/esankhyiki-mcp
  formats: [JSON]
funding:
  funders: [Ministry of Statistics and Programme Implementation]
related: [esankhyiki, nfhs, mospi-microdata]
---

Built by MoSPI's Data Innovation Lab with Bharat Digital, and released
under the MIT licence — a government statistics office publishing its own
access layer as open source, which is rarer than it should be.

The 27 datasets are most of the official series: PLFS for employment, CPI
and WPI for prices, IIP and ASI for industry, national accounts, the
economic census, household consumption, time use, AISHE and UDISE for
education, NFHS for health, and NSS rounds on agriculture, disability and
informal enterprises.

What it changes is who can ask. The underlying eSankhyiki APIs already
existed; the barrier was knowing the dataset codes and query grammar
before you could ask a question. This removes that step, which matters
most for the people least likely to be writing the query themselves.
