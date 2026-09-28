---
name: BharatViz
url: https://bharatviz.saketlab.org/
blurb: Free, open-source tool that turns a two-column CSV into a clean state or district choropleth map of India
kind: tool
orgType: academic
topics: [governance, demography]
geography: [india]
licensing: open
license: MIT
access: free
people:
  - name: Saket Choudhary
    url: https://saketlab.org/
links:
  - label: REST API
    url: https://bharatviz.saketlab.org/api/
  - label: GitHub
    url: https://github.com/saketlab/bharatviz
retrieval:
  api: true
  apiUrl: https://bharatviz.saketlab.org/api/
partOf: Saket Lab, IIT Bombay
related: [India Geodata, censusindia, Genome of India]
added: 2026-09-28
status: live
verifiedAt: 2026-09-28
---

BharatViz is a map maker for Indian data from Saket Lab at IIT Bombay. Paste or upload a CSV with a state name and a value, or a state, district and value for district maps, and it draws a clean choropleth with current boundaries in a few seconds.

It covers all states and union territories and every district. You can choose from sequential colour scales (blues, greens, viridis, magma and others) or diverging ones for data centred on a midpoint, and download the result as an image.

There are three ways to use it beyond the web app:
- **Embeds**: an iframe or a small JavaScript widget that draws the map live from a CSV hosted anywhere, so a published chart updates when the data does.
- **REST API**: send the data as JSON and get the map back as an image, with documented examples in Python, R and Node.js.
- **Self-hosting**: the React front end and the API server are both MIT licensed and run locally.

It is the tool behind the state maps in the Genome of India newsletter.
