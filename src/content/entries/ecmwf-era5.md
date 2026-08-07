---
name: "ECMWF ERA5"
url: "https://www.ecmwf.int/en/forecasts/dataset/ecmwf-reanalysis-v5"
blurb: "Fifth-generation global climate reanalysis from ECMWF — hourly atmospheric, land, and ocean variables from 1940 to near-present at 0.25° resolution"
kind: dataset
orgType: multilateral
topics: ["climate", "environment", "water"]
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
  from: 1940
  updated: daily
added: "2026-08-07"
status: live
---

ERA5 is the de facto standard for global climate data in research and industry. It provides hourly estimates for hundreds of atmospheric, land-surface, and ocean-wave parameters at 0.25° (~31 km) resolution, from 1940 to within 5 days of real time. The ERA5-Land subset gives finer land-surface detail at 9 km. Undisputed as the most widely used gridded climate dataset for any region that lacks dense station networks — which includes most of India.
