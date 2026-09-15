---
name: India Geodata
url: https://github.com/yashveeeeeeer/india-geodata
blurb: Unified repository of open geospatial data for India, covering administrative boundaries, transport, hydrology, environment, and an in-browser map maker
kind: dataset
orgType: individual
topics: [land, governance, transport, environment]
geography: [india]
licensing: open
license: CC-BY-4.0
access: free
people:
  - name: Yashveer Singh
    url: https://github.com/yashveeeeeeer
links:
  - label: Web Portal
    url: https://yashveeeeeeer.github.io/india-geodata/
  - label: India Map Maker
    url: https://yashveeeeeeer.github.io/india-geodata/maps/
  - label: GitHub Releases
    url: https://github.com/yashveeeeeeer/india-geodata/releases
retrieval:
  bulkDownload: true
  formats: [parquet, pmtiles, geojson, shp]
coverage:
  updated: irregular
related: [datameet, survey-of-india-maps]
added: 2026-09-15
status: live
verifiedAt: 2026-09-15
---

India Geodata is an open-access repository curated by Yashveer Singh that consolidates and standardizes more than 1,800 geospatial files across India into modern, cloud-optimized formats.

The collection harmonizes datasets from official sources (Survey of India, Local Government Directory, ISRO Bhuvan, Forest Survey of India, Ministry of Rural Development, WRIS) and civic data initiatives (DataMeet, SHRUG, OpenStreetMap). Key layers include:
- **Administrative & Electoral**: Country, state, district, subdistrict, block, gram panchayat, village, and habitation boundaries, as well as parliamentary and assembly constituencies.
- **Environment & Water**: Forest cover, coastal regulation zones, Digital Soil Map of the World polygons, multi-source flood event inventories, rivers, lakes, reservoirs, watersheds, and water body census data.
- **Infrastructure & Facilities**: PMGSY rural road networks (GeoSadak), national highways, Indian Railways, inland waterways, and geocoded public health and educational facilities.
- **India Map Maker**: A zero-install, client-side web tool (`yashveeeeeeer.github.io/india-geodata/maps/`) allowing users to paste tabular data (from CSV, Excel, or Google Sheets) and render clean choropleth maps exported as PNG, SVG, or PDF.

All layers are converted to analysis-friendly formats including GeoParquet, PMTiles, GeoJSONL, and Shapefiles, with large assets distributed via GitHub Releases.
