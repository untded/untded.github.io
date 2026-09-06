# 17 — Strip process/validation language from the public site

## Problem

The site still talked about its own production: "digitized with verifiable
provenance", "verified dataset", "extraction confidence", "verification code",
"front-matter OCR", "D.05B cross-check", "Source PDFs & provenance". Visitors
need the directory, not our pipeline. Worse, two data leaks rode along:

- `provenance.pdf` named **UNTDED2005_Redacted.pdf** — the private working
  copy — in the public YAML, CSV, JSON and elements.json.
- `provenance.confidence` (high/medium/low) — an internal transcription
  triage grade — shipped in every element of the public dataset.

## Changes

### Dataset (untded/untded-2005 PR #5)

- `Provenance` model reduced to `page` (the publication is identified at
  document level; the page locates the entry). YAML SSOT migrated (9 files).
- Extractor: `join_fragments` returns text only (the join-metadata existed
  solely to compute confidence); elements no longer stamped with confidence;
  the review queue keeps its own triage `confidence` for extraction workflow.
- Exporter: CSV drops `confidence`/`pdf` columns; HTML drops the Conf. column;
  `elements.json` header `extracted_from` (private filename) → `pages`.
- Linked Data: `extractionConfidence` removed from element nodes, ontology
  (1532 nodes, 14 properties) and the YAML-LD context.
- Validator/`bin/extract` stats no longer report confidence tallies.

### Website (this PR)

- `ProvenanceCard` → a single "Source" link: *ECE/TRADE/362, page N ↗*.
- Home: meta description, hero ("one open dataset"), download card — no
  "verified", no "digitization and verification code".
- About: mission ("open, machine-readable dataset"), platform sentence
  ("dataset, website and source code"), licensing ("The code and this
  website are open source").
- Download: YAML card names pages not confidence; references card → "Source
  publication"; meta description loses "single source of truth"; attribution
  "cite … this dataset".
- `data.ts` `Provenance` = `{ page }`; `meta.json` dead `provenance` block
  (unread, and named the private PDF) removed.
- Data re-synced: zero `extractionConfidence`/`Redacted` under `data-source/`
  and `public/`.

## Verified

- Dataset: 31 specs green; derived CSV/JSON/HTML/RDF scanned — only hits are
  real dictionary content (3220 "Country of provenance", 4240 "ascertained or
  verified", 6074 "confidence interval").
- Website: 59 tests green, `astro check` clean, dist grep for
  confidence/verifiable/verification/provenance/OCR/extract/Redacted returns
  only those same three elements' source text.

## Rule

Public artifacts carry directory content and a source pointer. Pipeline
state (confidence grades, working filenames, OCR/cross-check details) stays
in the tooling that produces it.
