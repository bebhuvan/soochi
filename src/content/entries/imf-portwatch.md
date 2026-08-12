---
name: "IMF PortWatch"
url: "https://portwatch.imf.org/"
blurb: "Daily port calls and maritime trade estimates from vessel movements, with disruption monitoring and supply-chain simulations"
kind: dataset
orgType: multilateral
topics: ["economy", "transport", "climate", "disasters"]
geography: ["global", "india"]
licensing: unknown
access: free
alternateNames: ["PortWatch"]
retrieval:
  api: true
  apiUrl: "https://portwatch.imf.org/datasets/83b1bbc7b3354c5fb1f40673bb8f852e/api"
  bulkDownload: true
  formats: ["csv", "geojson", "kml", "zip"]
coverage:
  from: 2018
  updated: weekly
links:
  - label: "Data and methodology"
    url: "https://portwatch.imf.org/pages/data-and-methodology"
  - label: "Port Monitor"
    url: "https://portwatch.imf.org/pages/port-monitor"
  - label: "Disruption Monitor"
    url: "https://portwatch.imf.org/pages/disruption-monitor"
  - label: "Spillover Simulator"
    url: "https://portwatch.imf.org/pages/spillover-simulator"
added: "2026-08-12"
status: live
verifiedAt: "2026-08-12"
---

PortWatch is the IMF's open platform for tracking maritime trade and testing how disruptions could spread through supply chains. It derives daily port calls and preliminary import and export volumes from satellite-captured Automatic Identification System signals, covering more than 2,000 ports and major maritime chokepoints worldwide, including ports in India. Researchers can download the underlying geographic and time-series data or query its ArcGIS APIs; the principal activity datasets are updated weekly. The platform also maps natural-disaster and geopolitical disruptions, simulates port-to-port and country-level spillovers, and compares present and future climate risks. These are experimental estimates rather than official trade statistics: they cover shipping rather than every transport mode, and gaps or spoofing in vessel signals can cause revisions.
