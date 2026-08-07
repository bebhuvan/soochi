---
name: "CHIRPS Rainfall Data"
url: "https://www.chc.ucsb.edu/data/chirps"
blurb: "High-resolution rainfall estimates combining satellite observations and gauge data — 40+ years of quasi-global precipitation at 0.05°, updated daily"
kind: dataset
orgType: academic
topics: ["climate", "agriculture", "water", "disasters"]
geography: ["global", "india"]
licensing: open
access: free
retrieval:
  api: true
  apiUrl: "https://data.chc.ucsb.edu/products/CHIRPS-2.0/"
  bulkDownload: true
  formats: ["geotiff", "netcdf"]
coverage:
  from: 1981
  updated: daily
added: "2026-08-07"
status: live
---

CHIRPS (Climate Hazards Group InfraRed Precipitation with Station data) is one of the most widely used datasets in development research. At 0.05° (~5.5 km) resolution with daily data from 1981, it is ideal for drought monitoring, crop yield analysis, flood early warning, and food security research. CHIRPS3 (released 2025) extends coverage to 1983-present with improved algorithms and global coverage beyond 50° latitude. For India, CHIRPS matches well with IMD station data and is the standard rainfall input for FEWS NET famine early warning. Combine with AGMARKNET mandi prices or MGNREGA wage data for powerful rural distress analysis.
