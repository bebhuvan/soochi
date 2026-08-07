---
name: "NASA POWER"
url: "https://power.larc.nasa.gov/"
blurb: "NASA's solar and meteorological data — daily temperature, precipitation, radiation, wind, and humidity from 1981, for renewable energy and agriculture"
kind: dataset
orgType: government
topics: ["climate", "energy", "agriculture", "water"]
geography: ["global", "india"]
licensing: open
access: free
retrieval:
  api: true
  apiUrl: "https://power.larc.nasa.gov/api/pages/"
  bulkDownload: true
  formats: ["csv", "json", "netcdf"]
coverage:
  from: 1981
  updated: daily
added: "2026-08-07"
status: live
---

NASA POWER (Prediction of Worldwide Energy Resources) provides global gridded meteorological data at 0.5° resolution from 1981 to near-real-time (2-3 day delay). Parameters include temperature, precipitation, relative humidity, solar radiation (GHI, DNI, DIF), and wind speed — the exact variables needed for solar panel sizing, crop modelling, and water balance calculations. It has a straightforward REST API, an interactive Data Access Viewer, and is widely used in regions without dense ground instrumentation.
