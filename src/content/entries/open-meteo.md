---
name: "Open-Meteo"
url: "https://open-meteo.com/"
blurb: "Free open-source weather API — forecasts and historical weather from 1940 using the best global models, with no API key or registration required"
kind: dataset
orgType: commercial
topics: ["climate", "disasters", "agriculture", "energy"]
geography: ["global", "india"]
licensing: open
access: free
license: "CC BY 4.0"
retrieval:
  api: true
  apiUrl: "https://open-meteo.com/en/docs"
  bulkDownload: true
  formats: ["json", "csv"]
coverage:
  from: 1940
  updated: daily
added: "2026-08-07"
status: live
---

Open-Meteo aggregates the best open forecast models (GFS, ECMWF IFS, DWD ICON, MeteoFrance, JMA, GEM) and historical reanalysis (ERA5, ERA5-Land, CERRA) behind a clean REST API — no API key, no registration, no rate limits. For any coordinate in India, you can get 7-day to 16-day forecasts or 80+ years of hourly historical weather. Air quality forecasts from CAMS are also available. Increasingly used as a drop-in replacement for commercial weather APIs in research and civic tech.
