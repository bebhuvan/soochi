---
name: censusindia
url: https://censusindia.saketlab.org/
blurb: R package with digitised Census of India data from 1901 to 2011 at state, district and subdistrict level, ready to map
kind: tool
orgType: academic
topics: [demography, caste, culture]
geography: [india]
licensing: open
license: MIT
access: free
people:
  - name: Saket Choudhary
    url: https://saketlab.org/
links:
  - label: GitHub
    url: https://github.com/saketlab/censusindia
  - label: Getting started
    url: https://censusindia.saketlab.org/articles/
retrieval:
  bulkDownload: true
coverage:
  from: 1901
  to: 2011
  updated: static
partOf: Saket Lab, IIT Bombay
related: [Census of India, BharatViz, janapada, srsindia]
added: 2026-09-28
status: live
verifiedAt: 2026-09-28
---

censusindia is an R package from Saket Lab at IIT Bombay that puts a century of the Census of India into a single function call. It covers every census from 1901 to 2011 at the state and district level, and subdistricts where the data allows.

The data includes:
- **Population counts and the Primary Census Abstract**: population, literacy, workers and sex ratio.
- **SC and ST tables**: the scheduled caste and scheduled tribe populations and how they are distributed.
- **Mother tongue tables**: speakers of each language by district for 2011, along with a ready-made measure of each district's linguistic diversity.
- **Population projections**: MoHFW projections from 2011 to 2036 by state and district.

Any table can be joined to district boundaries for its census year with `attach_geometry()`, and `plot_map()` and `compare_maps()` draw choropleths directly. Search functions such as `search_census_variables("literacy")` help you find the right column without digging through census codebooks. The package site includes worked articles on sex ratio, tribal isolation, social composition and population change.

It installs with `pak::pak("saketlab/censusindia")`.
