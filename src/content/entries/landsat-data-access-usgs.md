---
name: "Landsat Data Access (USGS)"
url: "https://www.usgs.gov/landsat-missions/landsat-data-access"
blurb: "Decades of free satellite imagery from the Landsat programme — the longest continuous Earth observation record, essential for studying change over time"
kind: dataset
orgType: government
topics: ["land", "environment", "agriculture", "water"]
geography: ["global", "india"]
licensing: open
access: free
retrieval:
  api: true
  apiUrl: "https://m2m.cr.usgs.gov/"
  bulkDownload: true
  formats: ["geotiff"]
coverage:
  from: 1972
  updated: daily
added: "2026-08-07"
status: live
---

Landsat provides the longest continuous space-based record of Earth's land surface — from 1972 to present at 30 m resolution (15 m panchromatic). For India, this is the go-to source for studying urban expansion, deforestation, water body change, agricultural land conversion, coastal erosion, and glacial retreat over five decades. Accessible through USGS EarthExplorer, the M2M API, and Google Earth Engine. Landsat 8 and 9 (currently operational) provide 8-day revisit. Landsat Next will bring 10 m resolution and 6-day revisit starting around 2031.
