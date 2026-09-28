---
name: Varunayan
url: https://varunayan.saketlab.org/
blurb: Open Python and R toolkit for downloading ERA5 and IMD climate data for any region and computing heat stress indices
kind: tool
orgType: academic
topics: [climate, health, environment]
geography: [india, global]
licensing: open
license: MIT
access: free
alternateNames: [varunayanR]
people:
  - name: Atharva Jagtap
  - name: Saket Choudhary
    url: https://saketlab.org/
links:
  - label: varunayanR (R package)
    url: https://varunayanr.saketlab.org/
  - label: GitHub (Python)
    url: https://github.com/saketlab/varunayan
  - label: GitHub (R)
    url: https://github.com/saketlab/varunayanR
partOf: Saket Lab, IIT Bombay
related: [ECMWF ERA5, India Meteorological Department, Copernicus Climate Data Store, Genome of India]
added: 2026-09-28
status: live
verifiedAt: 2026-09-28
---

Varunayan is a climate data toolkit from Saket Lab at IIT Bombay. It takes the tedious part out of working with gridded weather data: you give it a bounding box, a GeoJSON boundary or a point, and it fetches the data, clips it to your region and returns a clean daily or monthly time series.

It pulls from four sources:
- **ERA5** reanalysis from Copernicus, at 0.25° resolution from 1940 onwards, including pressure-level variables.
- **IMD** gridded rainfall and temperature for India, from 1901 onwards.
- **HadEX3** global indices of climate extremes.
- **CRU TS** monthly climate grids at 0.5° resolution from 1901 onwards.

On top of the downloads it computes heat stress measures (UTCI, wet bulb globe temperature, heat index and humidex), aggregates temperature to the country or state level, and includes helpers for monsoon analysis.

The Python package installs from PyPI and works both as a library and from the command line. varunayanR is its R counterpart with the same data sources and a similar interface. Both are MIT licensed. ERA5 downloads need a free Copernicus Climate Data Store account.
