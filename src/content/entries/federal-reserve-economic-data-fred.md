---
name: Federal Reserve Economic Data (FRED)
url: https://fred.stlouisfed.org
blurb: FRED provides downloadable economic and financial time series from many official sources, with graphs, API access, and frequent U.S. macro updates
kind: dataset
orgType: government
topics: [economy, public-finance]
geography: [north-america]
licensing: unknown
access: free
alternateNames: [FRED, St. Louis Fed Economic Data]
links:
  - label: "FRED API documentation"
    url: "https://fred.stlouisfed.org/docs/api/fred/v2/"
retrieval:
  api: true
  apiUrl: "https://fred.stlouisfed.org/docs/api/fred/v2/"
  bulkDownload: true
  formats: ["csv", "json", "xml"]
added: 2026-08-08
status: live
---

FRED is a large multi-source database run by the Federal Reserve Bank of St. Louis, with a broad range of macroeconomic and financial series. It supports fast discovery by topic and source, and has one of the most used public APIs for downloading U.S. and international data.

In practice, FRED is most valuable for cross-series time-series workflows: building consistent indicator sets, checking revisions, and pairing releases (jobs, inflation, debt, rates) with research or reporting.
