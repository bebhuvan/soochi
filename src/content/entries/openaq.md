---
name: "OpenAQ"
url: "https://openaq.org/"
blurb: "Aggregated ground-level air quality from 150+ countries — harmonised, API-accessible, and far easier to work with than individual government portals"
kind: dataset
orgType: nonprofit
topics: ["environment", "health", "cities"]
geography: ["global", "india"]
licensing: open
access: free
retrieval:
  api: true
  apiUrl: "https://docs.openaq.org/"
  bulkDownload: true
  formats: ["csv", "json"]
coverage:
  from: 2015
  updated: live
added: "2026-08-07"
status: live
---

OpenAQ is the single best starting point for anyone doing air pollution research in India. It aggregates PM2.5, PM10, NO₂, SO₂, CO, O₃, and BC data from government monitoring networks (CPCB in India), low-cost sensors, and reference-grade instruments worldwide — all harmonised to a common format with a fast REST API. For India, this means you query data from Delhi, Kanpur, Bengaluru, and Mumbai in the same API call with the same units and quality flags, instead of wrangling separate state PCB portals. The platform is free, community-governed, and powers most air quality apps and research papers.
