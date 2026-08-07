---
name: "NOAA Climate Data Online"
url: "https://www.ncei.noaa.gov/cdo-web/"
blurb: "NOAA's archive of historical weather — station-level daily summaries, global hourly data, and normals for tens of thousands of stations worldwide"
kind: dataset
orgType: government
topics: ["climate", "environment", "disasters"]
geography: ["global", "india"]
licensing: open
access: free
retrieval:
  api: true
  apiUrl: "https://www.ncei.noaa.gov/cdo-web/webservices/v2"
  bulkDownload: true
  formats: ["csv", "json"]
coverage:
  from: 1763
  updated: daily
added: "2026-08-07"
status: live
---

CDO is the primary access point for NOAA's vast historical weather archive. For India, it offers daily summaries (temperature, precipitation, wind) from ~200 stations with records stretching back decades — an essential complement to IMD data, particularly for cross-border analysis and for Indian regions where IMD data is hard to obtain. Also publishes the US 1991-2020 Climate Normals and the Global Historical Climatology Network (GHCN-D).
