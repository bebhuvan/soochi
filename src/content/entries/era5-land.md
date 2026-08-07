---
name: "ERA5-Land"
url: "https://cds.climate.copernicus.eu/datasets/reanalysis-era5-land"
blurb: "Enhanced-resolution land-surface reanalysis — temperature, rainfall, soil moisture, and evaporation at 9 km, from 1950 to near-present, complementary to ERA5"
kind: dataset
orgType: multilateral
topics: ["climate", "land", "agriculture", "water"]
geography: ["global", "india"]
licensing: open
access: free
license: "Copernicus Licence"
retrieval:
  api: true
  apiUrl: "https://cds.climate.copernicus.eu/api-how-to"
  bulkDownload: true
  formats: ["netcdf", "grib"]
coverage:
  from: 1950
  updated: monthly
added: "2026-08-07"
status: live
---

ERA5-Land is the land-focused, higher-resolution sibling of ERA5. At 9 km (versus ERA5's 31 km), it provides finer detail for temperature, precipitation, soil moisture, evaporation, runoff, and other land-surface variables from 1950 onwards. For India, the resolution improvement is significant: ERA5-Land better captures the Western Ghats orographic rainfall gradient, local temperature variations, and soil moisture patterns that coarser reanalysis smooths out. It uses the same underlying atmospheric forcing as ERA5 but runs a dedicated land-surface model at higher resolution. Accessible through the same CDS API.
