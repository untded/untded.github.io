# 08 — Bridges map: the directory as a document system

The bridges column says where each element lives on real document systems:
UNLK, MAR, CIMP, SAD, AWB, CIM, CMR… We plot that system, the way the UNLK
explorer plots the master form.

## Work

- Dataset: bridge scheme counts per element exported (rides on 01's
  structured bridges — no new parsing).
- Website `/bridges` page:
  - overview strip: elements per scheme, ordered by coverage;
  - a matrix or chord view: scheme × category coverage;
  - per-scheme view: the elements bridged to that scheme as a compact
    table (tag, name, location string), linking to element pages;
  - cross-links: element pages' bridges section gains "see all MAR
    elements" links; the UNLK scheme view deep-links into the /unlk
    explorer.
- Interactions modest: filters by scheme/category; no heavy charting
  dependency — SVG/grid like the rest of the site.

## Verification

- Contracts: /bridges built; per-scheme counts match the dataset export;
  every listed element link resolves (internal lychee).
- Spot check: MAR coverage count equals `grep -c` on the data.

## Beats

Their diagrams explain their invented domains; ours explains the actual
document ecosystem the directory serves — the master-document principle,
visible across every carrier scheme at once.
