# 27 — Card adoption: convert the homepage (manual, not regex)

Card.astro exists (track 26) but zero call sites use it. The homepage
has 11 card-pattern anchors — the highest-traffic page and the right
first adoption. Manual conversion (not regex — that proved fragile
with nested anchors).

## Tasks

- [x] Import Card in index.astro (inside the frontmatter, after the
      other component imports)
- [x] Replace the 11 card-pattern anchors with `<Card href={...}>`
      — the card grid, the explore section, the governance cards
- [x] Verify: build, tests, screenshot

## Why

DRY: the pattern lives in one file. If the card design changes
(padding, hover, border), it's one edit. The homepage is the most
visible page — adopting there establishes the pattern for the rest.
