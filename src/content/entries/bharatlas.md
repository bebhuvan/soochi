---
name: bharatlas
url: https://bharatlas.com/
blurb: Open atlas for viewing, filtering, downloading and contributing Indian geospatial layers, from boundaries and wards to rivers and roads
kind: dataset
orgType: individual
topics: [land, cities, governance, environment]
geography: [india]
licensing: open
access: free
alternateNames: [Bharat Atlas]
people:
  - name: Sathya Sankaran
    role: Creator
    url: https://www.sathyasankaran.com/
links:
  - label: API documentation
    url: https://bharatlas.com/docs
  - label: Contribute a layer
    url: https://bharatlas.com/contribute
  - label: Source code
    url: https://github.com/urbanmorph/geodata
retrieval:
  api: true
  apiUrl: https://bharatlas.com/docs
  bulkDownload: true
  formats: [Parquet, PMTiles, GeoJSON, KML, SHP]
coverage:
  updated: live
added: 2026-08-22
status: live
verifiedAt: 2026-08-22
---

bharatlas brings Indian administrative boundaries, city wards and thematic
map layers into one searchable catalogue. Layers can be viewed in the browser,
sliced, queried through a public API and downloaded in common GIS formats
without an account or API key.

Each layer keeps its own source, licence and freshness metadata. Community
submissions are checked for licensing and basic geometry validity but not for
accuracy, so verify their provenance before sensitive use.
