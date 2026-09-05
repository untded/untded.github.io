# unt·ded — the UNTDED registry website

The public registry website for the digitized **UNTDED 2005** (United
Nations Trade Data Elements Directory, ECE/TRADE/362 = ISO 7372:2005):
1504 data elements, machine-readable, with verifiable provenance.
Operated on behalf of **UN/CEFACT (UNECE)** and **ISO/TC 154** — see
[`/about`](https://untded.github.io/about) for the mandate (ISO/TC 154
N1727, resolutions P-2026-06/07).

Live at **https://untded.github.io** (untded.org to follow once the site
is fully operational).

## Stack

Astro 7 (static) · Vite 8 · Vue 3 islands (`src/islands/`) · Tailwind
CSS 4 via `@tailwindcss/vite` · Pagefind full-text search · Node 22.

## Commands

```sh
npm run sync-data   # pull elements.json from ../untded-2005 (the SSOT) into data-source/
npm run build-data  # data-source -> public/data/{index,meta}.json (pure seams, tested)
npm run dev         # build-data + astro dev
npm run build       # build-data + astro build + pagefind
npm test            # vitest: lib specs + dist-based page contracts (needs a build)
npm run links       # lychee internal link check over dist/
```

## Architecture

```
data-source/elements.json   committed sync of the dataset SSOT (npm run sync-data)
scripts/                    sync + build-data pipelines; pure seams in scripts/lib/ with specs
src/lib/data.ts             the only data accessor (typed)
src/lib/element.ts          domain SSOT: labels, categories, bridges, pointers
src/lib/*-filter.ts         pure seams behind the islands (thin Vue shells)
src/lib/*.spec.ts           sibling specs + dist-based site contracts
src/islands/                RenameLedger, DirectoryFilter, Omnibox (Vue)
src/components/             Astro components (TagPlate, ReprChip, …)
src/pages/                  / · /elements/… · /categories/… · /notation /method /download /about /search · 404
```

Routes: 1504 element pages + 9 category pages + content pages — all
static. The directory island fetches `/data/index.json` (compact wire
format, generated at build); the no-JS baseline is the full SSR table.

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
