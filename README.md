# UN/TDED — the registry website

The public registry website for the digitized **UNTDED 2005** (United
Nations Trade Data Elements Directory, ECE/TRADE/362 = ISO 7372:2005):
1504 data elements, machine-readable, with verifiable provenance.
Operated on behalf of **UN/CEFACT (UNECE)** and **ISO/TC 154** — see
[`/about`](https://untded.github.io/about) for the mandate (ISO/TC 154
N1727, resolutions P-2026-06/07).

Live at **https://www.untded.org**.

## Stack

Astro 7 (static, MDX for the docs corpus) · Vite 8 · Vue 3 islands
(`src/islands/`) · Tailwind CSS 4 via `@tailwindcss/vite` · Pagefind
full-text search · Node 22.

## Commands

```sh
npm run sync-data   # pull elements.json + graph + vocabulary.json + edifact-links.json + context.jsonld from ../untded-2005 (the SSOT)
npm run build-data  # data-source -> public/data/* + per-element RDF + /ns context (pure seams, tested)
npm run dev         # build-data + astro dev
npm run build       # build-data + astro build + pagefind
npm test            # vitest: lib specs + dist-based page contracts (needs a build)
npm run links       # lychee internal link check over dist/
```

## Architecture

```
data-source/                committed sync of the dataset SSOT (npm run sync-data):
  elements.json, categories.json, untded.{jsonld,ttl}, vocabulary.json,
  edifact-links.json, context.jsonld, rdf/ (per-element TTL + JSON-LD)
scripts/                    sync + build-data pipelines; pure seams in scripts/lib/ with specs
src/lib/data.ts             the single data seam: loadJson + elements, categories,
                            JSON-LD node access (all node:fs lives here)
src/lib/element.ts          pure domain SSOT: labels, change-tag legend, bridges,
                            pointers — no node imports, safe in client bundles
src/lib/vocabulary.ts       ontology declaration loader (/ontology, from vocabulary.json)
src/lib/parser-parity.spec  TS ports must reproduce the dataset's parser fixtures
src/lib/edifact.ts          EDED join loader (element-page chips, from edifact-links.json)
src/lib/tree.ts             name-hierarchy seam behind /tree
src/lib/*-filter.ts         pure seams behind the islands (thin Vue shells)
src/lib/*.spec.ts           sibling specs + dist-based site contracts
src/islands/                RenameLedger, DirectoryFilter, TreeBrowser, Omnibox, UnlkExplorer (Vue)
src/components/             Astro components (TagPlate, ReprChip, UnlkForm, PositionRuler, …)
src/layouts/DocsLayout.astro  shared prose layout for the MDX docs corpus
src/pages/                  routes below · .github/ISSUE_TEMPLATE/ DMR forms
```

Routes: 1504 element pages (each serving `data.ttl`/`data.jsonld` +
`rel=alternate`) + 9 category pages + the UNLK explorer (`/unlk`) and the
content surface — `/document` (the publication's own text, cover to
presentation rules, with a page-by-page coverage table), `/ontology` (the
model), `/ledger` (the 1993↔2005 change tags), `/bridges` (carrier-scheme
coverage), `/docs` (MDX guides: ontology, EDIFACT alignment, vocabulary
register, provenance, JSON-LD context, contributing), `/notation`,
`/download`, `/about`, `/search`, `/tree` — plus the JSON-LD context at
`/ns/untded-context.jsonld`. All static. The directory island fetches
`/data/index.json` (compact wire format, generated at build); the no-JS
baseline is the full SSR table.

## Data flow

`untded/untded-2005` (Ruby, YAML SSOT) —`bin/export`→ `elements.json`
—`npm run sync-data`→ `data-source/` (committed) —`build-data`→
`public/data/`. CI never needs Ruby: it builds from the committed sync.

## Deploy

`main` → GitHub Actions → GitHub Pages (`.github/workflows/deploy.yml`,
pubid-pattern). PRs get build + tests + offline link check. **All
changes to `main` go through PRs.**

## Attribution

Content © United Nations / UNECE (ECE/TRADE/362), reproduced with
attribution. Site code MIT. Identity: UN-like palette (official UN blue
#009EDB) but no UN emblem — the UN reserves its emblem and name to itself.
