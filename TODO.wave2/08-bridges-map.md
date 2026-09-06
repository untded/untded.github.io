# 08 — Bridges map: the directory as a document system

The bridges column says where each element lives on real document
systems: UNLK, MAR, CIMP, SAD, AWB, CIM, CMR… We plot that system, the
way the UNLK explorer plots the master form. Data from 01's
`derived/bridges.json`. Branch: `wave2-pages`.

## Tasks

- [x] ~~bridges-data.ts~~ — dropped: the page derives from elements.json
      via parseBridges (same parser as everywhere).
- [x] `src/pages/bridges.astro`:
  - [x] overview strip: elements per scheme, ordered by coverage, each
        chip linking to its section anchor
  - [x] coverage matrix: scheme × category (9 rows), cell = count with
        tint; title attr listing nothing further (keep it light)
  - [x] per-scheme sections: compact table (tag, name, printed location)
        of the elements bridged to that scheme, linking to element pages
  - [x] UNLK section: links into the /unlk explorer; AWB/CIMP/CIM/CMR/
        SAD/MAR each get the per-scheme table
  - [x] intro copy: what bridges are (publication §4.1 presentation
        rules; the master-document principle), citation
- [x] Cross-links: element pages' bridges section gains "all elements on
      `<scheme>`" links; /unlk links to /bridges#UNLK; footer registry
      row gains Bridges.
- [x] Contracts: /bridges built; per-scheme counts in the HTML match
      `bridges.json`; every element link resolves; matrix cells sum.

## Verification

Dataset spec: bridges.json counts match a fresh parse of the YAML;
website build + tests; screenshot review.

## Beats

Their diagrams explain their invented domains; ours explains the actual
document ecosystem the directory serves — the master-document principle,
visible across every carrier scheme at once.
