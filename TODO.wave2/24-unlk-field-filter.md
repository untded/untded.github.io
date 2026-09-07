# 24 — UNLK field filter: highlight what you care about

The explorer shows every bridged field. Implementers designing a
document want to see only their subset — search by tag or name, the
form dims everything else.

## Tasks

- [x] A filter input above the explorer (same filter-btn kit); typing
      dims non-matching fields (opacity), matching fields stay full.
      Matches on tag number and element name substring.
- [x] The detail panel and band stats update to reflect the filter
      (counts show matched/total).
- [x] Contracts: the filter input present; the dimming class applied
      via a CSS rule (no JS-dependent contract — assert the input and
      the CSS class exist).

## Beats

Their diagrams are static; ours is a working instrument — search,
dim, inspect, all keyboard-accessible.
