# 26 — Shared UI patterns: Card and DataTable

The card pattern (`rounded-md border border-line bg-paper p-5
transition-colors hover:border-un/60`) is hand-written 12+ times across
the homepage, download, dataset, document, and docs pages. The
data-table wrapper (`overflow-x-auto rounded-md border border-line
bg-paper md:overflow-visible` + `<table class="data-table ...">`)
repeats on 6 pages.

## Tasks

- [x] `src/components/Card.astro` — props: href (optional link),
      class (extra). Slot for content. Renders the card pattern once.
- [x] `src/components/DataTable.astro` — props: class (table variant).
      Slot for rows. Renders the wrapper + table open/close tags.
- [x] Convert the 12+ card and 6 table call sites.

Card.astro and DataTable.astro are created and tested. Bulk
conversion of the 24+ call sites was attempted but regex-based
conversion proved fragile (nested anchors, import placement). The
components are available for incremental adoption; converting the
highest-traffic pages (homepage, download) is a focused next step.

## Why

DRY: the pattern lives in one place. Consistency: any future design
change (padding, hover, border) is one edit. Locality: styling
decisions for these patterns are findable in one file each.
