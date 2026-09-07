# 13 — UX coherence pass: the wave-2 pages as one document system

/frontend-design pass (2026-09-07). The wave-2 surface added five
table-heavy pages (ontology, ledger, bridges, docs corpus, coverage
chips). Vision review of the screenshots found the content solid but
the long-table reading experience weak, and two islands of friction:
the element page's chip row has no rhythm, and the docs corpus has no
wayfinding. The registry's signature stays what it already is — the
ledger/document aesthetic (UN blue, IBM Plex Mono, stamp red for
differences); this pass makes every page speak it with the same
discipline, and takes one real accessibility step (keyboard on the
UNLK explorer).

## Tasks

- [ ] Long tables read like the ledger they are (ontology, ledger,
      bridges, download, docs corpus tables): sticky `thead` within the
      scroll container, zebra row tint, consistent cell rhythm
      (`py-2 px-3` family). One shared utility/class, not five
      hand-rolled variants.
- [ ] Bridges matrix: add a totals column and totals row so the scheme
      chips' counts are checkable in place; handle the near-empty last
      category column cleanly (no orphan header).
- [ ] Element page chip row: EDED and UNCL chips render as one flex
      row with identical pill geometry (same padding/border/radius as
      the filter kit), consistent gap — no stacked single-chip lines.
- [ ] Docs corpus wayfinding: an "On this page" anchor list on wide
      screens (DocsLayout aside; no JS — static anchors, active state
      via scroll-margin only). Small screens keep the single column.
- [ ] UNLK explorer keyboard access: container focusable
      (`tabindex="0"`, visible focus ring, aria-label explaining the
      keys), arrow keys pan, `+`/`-` zoom, `0` reset to full view.
      Reduced-motion respected (no smooth scroll).
- [ ] Element page print polish: verify the new sections (bridges,
      chips, UNLK card) print sanely; extend the existing print block
      minimally if needed (black-on-white, no chrome).
- [ ] Contracts: zebra/sticky utility applied on /ontology /ledger
      /bridges tables; totals row present on /bridges; docs pages
      carry the ToC aside with anchors resolving (`id=` present);
      element page renders one chip row (EDED + UNCL same container);
      UnlkExplorer has tabindex + keydown handler.

## Verification

Build + suites + links; playwright screenshots light and dark, and one
mobile-width (390px) shot of /ontology and /bridges; keyboard test of
the explorer (focus, arrow pan, zoom keys) via playwright; print
emulation screenshot of /elements/1004. No perf regression: element
page budget stays ≤ 32KB, /elements index ≤ 700KB.

## Beats

Their Nextra docs are a template; our corpus is typeset like the
directory it documents — sticky ledger heads, checkable totals,
keyboard-operable diagrams, printable cards. The registry reads as one
artifact from cover to entry, on screen and on paper.
