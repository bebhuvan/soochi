---
name: Open India Law
url: https://github.com/Vaquill-AI/open-india-law
blurb: Bulk dataset of 32.5M Indian judgment chunks, 1.1M legislation provisions, and tribunal matters, with the scrapers that build it
kind: dataset
orgType: commercial
topics: [justice, governance, transparency, technology]
geography: [india]
licensing: partly-open
access: free
alternateNames: [Vaquill Open India Law]
sourceUrl: https://github.com/Vaquill-AI/open-india-law
retrieval:
  bulkDownload: true
  formats: [parquet, json]
added: 2026-09-07
status: live
verifiedAt: 2026-09-07
---

Open India Law is a bulk dataset of Indian primary legal documents built and open-sourced by Vaquill AI, a commercial legal data company. It holds 32.5 million judgment chunks from the Supreme Court and 25 High Courts (1950-2025), 1.1 million legislation provisions across Central, State and Union Territory law, 813,000 tribunal and regulator matters from 15 forums, and vector embeddings for semantic search.

The repository ships the scrapers alongside the data: normalized text extracted from scanned PDFs, section-level indexing, Parquet files for bulk access, and Qdrant vector collections. Scripts are Apache 2.0; the compiled data is CC BY 4.0 with attribution required, while the underlying government text remains reproducible under Indian copyright law.
