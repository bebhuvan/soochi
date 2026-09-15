---
name: India District Nighttime Lights (VIIRS)
url: https://github.com/yashveeeeeeer/india-district-nightlights-viirs
blurb: District-level nighttime lights panel for India (641 districts, 2012–2024) from VIIRS satellite data, with annual radiance statistics and an automated pipeline
kind: dataset
orgType: individual
topics: [economy, cities, land, technology]
geography: [india]
licensing: open
license: MIT
access: free
alternateNames: [India District-Wise Nighttime Lights Database]
people:
  - name: Yashveer Singh
    url: https://github.com/yashveeeeeeer
links:
  - label: GitHub Repository
    url: https://github.com/yashveeeeeeer/india-district-nightlights-viirs
  - label: How-To Guide
    url: https://github.com/yashveeeeeeer/india-district-nightlights-viirs/blob/main/HOW-TO-USE.md
retrieval:
  bulkDownload: true
  formats: [csv, geojson]
coverage:
  from: 2012
  to: 2024
  updated: irregular
related: [district-level-satellite-measures-indian-economy, india-geodata]
added: 2026-09-15
status: live
verifiedAt: 2026-09-15
---

This repository provides an automated Python pipeline and ready-to-use panel dataset tracking satellite-observed nighttime luminosity across all 641 Indian districts (Census 2011 boundaries) from 2012 to 2024.

Built using NOAA / NASA Suomi NPP VIIRS Day/Night Band (DNB) annual median radiance composites via Google Earth Engine, the dataset includes:
- **Zonal Statistics**: Mean, median, sum, standard deviation, minimum, and maximum nighttime radiance (in nW/cm²/sr) per district-year, alongside valid pixel counts and log-transformed values (`log1p_mean`, `log1p_median`).
- **Data Formats**: An 8,333-row flat CSV panel (`output/csv/nightlights_district_panel.csv`) for immediate econometric analysis in Stata, R, Python, or DuckDB, plus annual GeoJSON layers for spatial mapping in QGIS or Kepler.gl.
- **Reproducible Pipeline**: An open-source workflow enabling researchers to authenticate with Earth Engine and customize boundary inputs, year ranges, or composite aggregations.

Nighttime luminosity serves as a widely utilized empirical proxy for subnational economic growth, electrification progress, and local urban density where high-frequency district GDP figures are unavailable.
