---
name: "NASA FIRMS"
url: "https://firms.modaps.eosdis.nasa.gov/"
blurb: "Satellite-detected fires and thermal anomalies in near-real-time — the standard source for tracking forest fires, crop burning, and industrial hotspots"
kind: dashboard
orgType: government
topics: ["environment", "climate", "agriculture", "disasters"]
geography: ["global", "india"]
licensing: open
access: free
retrieval:
  api: true
  apiUrl: "https://firms.modaps.eosdis.nasa.gov/api/"
  bulkDownload: true
  formats: ["csv", "json", "geojson"]
coverage:
  from: 2000
  updated: daily
added: "2026-08-07"
status: live
---

FIRMS (Fire Information for Resource Management System) distributes near-real-time active fire data from the MODIS and VIIRS satellite instruments. For India, FIRMS is the primary data source for tracking crop residue burning in Punjab and Haryana (the annual stubble-burning crisis), forest fires in the Western Ghats and Central India, and industrial thermal anomalies. The 3-hourly VIIRS data detects fires as small as a few hundred square metres. The Fire Map and API provide data within 3 hours of satellite overpass. Essential for environmental journalism and air pollution research.
