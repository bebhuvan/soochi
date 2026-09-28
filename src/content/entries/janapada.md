---
name: janapada
url: https://saketlab.github.io/janapada/
blurb: Interactive map and toolkit tracing how India's districts split, merged and were renamed from 1951 to 2024
kind: tool
orgType: academic
topics: [governance, demography, land]
geography: [india]
licensing: unknown
access: free
people:
  - name: Saket Choudhary
    url: https://saketlab.org/
links:
  - label: GitHub
    url: https://github.com/saketlab/janapada
coverage:
  from: 1951
  to: 2024
partOf: Saket Lab, IIT Bombay
related: [censusindia, India Geodata, BharatViz]
added: 2026-09-28
status: live
verifiedAt: 2026-09-28
---

janapada tracks how administrative boundaries change over time. Its main example is India's districts across census years from 1951 to 2024, a period in which they grew from a few hundred to more than 750.

Every present-day district is traced back to the district it came from and coloured by that original unit, so you can see at a glance which districts were carved out of which. Madras-era Srikakulam, for example, eventually splits into Srikakulam and Parvathipuram Manyam. The map shows splits, mergers and renames year by year.

This matters for anyone building a district-level time series. A district's figures in 2011 and in 1971 often describe different territory, and janapada's lineage table shows which old units a new district has to be matched back to.

The toolkit itself works for any country or level of administration. You supply a CSV of lineages, with one row per chain and one column per year, plus boundary GeoJSON files. A Node.js command then builds the lineage data, and a React component renders the interactive map. The repository does not state a licence yet.
