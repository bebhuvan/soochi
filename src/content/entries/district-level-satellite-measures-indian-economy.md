---
name: "District-level satellite measures of the Indian economy"
url: "https://www.xkdr.org/system/district-level-satellite-measures-of-the-indian-economy"
blurb: "District-level building volume and monthly nighttime lights for tracking physical capital and economic activity across India"
kind: dataset
orgType: nonprofit
topics: ["economy", "cities", "land", "technology"]
geography: ["india"]
licensing: open
access: free
license: "MIT"
alternateNames: ["India Built & Lit", "NighttimeLights and Built up volume dataset"]
sourceUrl: "https://xkdr.github.io/India-Built-and-Lit/"
retrieval:
  bulkDownload: true
  formats: ["csv", "geojson"]
coverage:
  from: 2014
  updated: irregular
links:
  - label: "GitHub repository"
    url: "https://github.com/xKDR/India-Built-and-Lit"
  - label: "Building-volume CSV"
    url: "https://xkdr.github.io/India-Built-and-Lit/data/bv_annual.csv"
  - label: "Nighttime-lights CSV"
    url: "https://xkdr.github.io/India-Built-and-Lit/data/viirs_monthly.csv"
added: "2026-08-12"
status: live
verifiedAt: "2026-08-12"
---

XKDR Forum combines two satellite-derived proxies for studying local economic change across India. Its annual building-volume series covers 2016–2023 using Google's Open Buildings 2.5D Temporal dataset, while its cleaned VIIRS nighttime-lights series runs monthly from 2014 onward. Both district panels are available as CSV downloads, and the repository includes district boundaries and Google Colab notebooks that researchers can reproduce or adapt for other countries. The measures can support work on economic geography, urbanisation and regional disparities, but they are proxies rather than district GDP estimates. XKDR flags the 2022 building snapshot as potentially problematic, and notes that shifts to more efficient LED lighting can lower recorded radiance even when underlying activity rises.
