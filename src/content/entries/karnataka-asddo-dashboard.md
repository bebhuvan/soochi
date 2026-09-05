---
name: Karnataka ASDDO Dashboard
url: https://gouthamganeshm.github.io/karnataka-asddo-dashboard/
blurb: Privacy-preserving static dashboard and EPIC lookup for 1.08 crore voter deletions across Karnataka under SIR 2026
kind: dashboard
orgType: collective
topics: [elections, governance, transparency, rights]
geography: [india, karnataka]
licensing: open
access: free
license: MIT
alternateNames: [Karnataka ASDDO Deletion List, ASDDO Voter Checker]
people:
  - name: Omshivaprakash H L
  - name: Goutham Ganesh M
links:
  - label: Live Dashboard
    url: https://gouthamganeshm.github.io/karnataka-asddo-dashboard/
  - label: Source code
    url: https://github.com/omshivaprakash/karnataka-asddo-dashboard
  - label: Karnataka Draft Roll 2026
    url: https://github.com/gouthamganeshm/Karnataka_Draft_Roll_2026
added: 2026-09-05
status: live
verifiedAt: 2026-09-05
---

The Karnataka ASDDO Dashboard is an open-source civic telemetry tool that lets voters check whether their EPIC card appears on the Chief Electoral Officer's ASDDO (Absent, Shifted, Death, Duplicate, Others) deletion list from the Special Intensive Revision (SIR 2026).

Covering 1.08 crore records across 59,027 booth PDFs and 224 constituencies, the site operates entirely client-side without servers or databases. Queries are hashed via SHA-256 in the browser to ensure voter EPIC numbers never leave the user's device, while parsing raw PDF byte streams directly to guarantee high fidelity across all 34 districts.
