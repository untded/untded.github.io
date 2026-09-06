# 04 — Edition ledger: 1993 ↔ 2005

The publication's change tags are an edition-migration ledger in embryo —
every row carries what changed against the 1993 edition. We hold them for
all 1504 elements; nobody has ever made them browsable. Branch:
`wave2-pages` (data from 01's `derived/ledger.json`).

## Tasks

- [x] ~~ledger.ts~~ — the page derives everything from elements.json
      (change tags + replacementPointer) at build time.
- [x] `src/pages/ledger.astro`:
  - [x] summary strip: 1504 elements → per-tag counts (add / cnd / cndr /
        cnr+cn+cr+cd / u / x) with the legend exactly as the publication
        prints it in section 4.1 — including the two outside-legend tags
        from the review queue, marked
  - [x] per-category breakdown table (9 categories × tag counts)
  - [x] replacement list: retired → use-instead (linked element pages),
        driven by the same parsed replacements as `utd:replacedBy`
  - [x] cross-links from ChangeTagBadge (element pages) to
        `/ledger#tag-<tag>`
- [x] `ChangeTagBadge.astro` — element pages wrap the badge in the ledger anchor: badge links its tag row to the ledger
      anchor (title attribute states the meaning — already present).
- [x] Contracts: /ledger built; counts sum to 1504; replacement rows
      match the parsed set (spot: 1002 → 1000); badge link present on
      /elements/1128.

## Verification

Dataset `ledger.json` spec asserts the counts against the YAML (no drift);
website build + tests; screenshot.

## Beats

vocab-bsp's migration ledger tracks their own UNSCRO rewrites; it says
nothing about TDED editions. This is the actual edition history of the
standard, generated from verified data.
