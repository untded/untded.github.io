# 05 — UN/EDIFACT crosslinks

The publication's own selling point (front matter): TDED is "fully
consistent with the set of UN/EDIFACT directories". We already hold the
D05B segments mirror and `bin/crosscheck-edifact`. Surface the join.
Branch: dataset `wave2-ontology` (export) + website `wave2-pages` (chip).

## Tasks

- [x] Dataset: `model/untded/edifact_join.rb` — the tag join (first
      occurrence per tag from `references/edifact-D05B/segments.xml`),
      shared by `bin/crosscheck-edifact` (refactor to call it, verdicts
      byte-identical) and the new `bin/join-edifact` →
      `derived/edifact-links.json` (see 01).
- [x] ~~Linked data seeAlso~~ — dropped: the main graph stays independent
      of the external mirror (deterministic builds); the machine-readable
      join ships as edifact-links.json and the chips link the docs page.
- [x] Website `src/lib/edifact.ts`: loader for `data-source/edifact-links.json`.
- [x] Element pages: "UN/EDIFACT" chip in the bridges/data area —
      `EDED <tag> · <type><max>` linking to
      `docs/alignment-edifact#eded-<tag>`; when representations
      corroborate, the chip reads aligned; when they differ, the chip
      shows the difference (no silent match — review-queue policy).
- [x] Chip absent for elements not in the mirror (the mirror covers only
      elements referenced by segments — state this on the docs page).
- [x] Contracts: chip + link on /elements/1004 (aligned case); a
      differing-representation case renders the difference; absent on an
      unmapped element (e.g. a 9xxx not in segments).

## Verification

`bin/crosscheck-edifact` verdicts unchanged after the refactor;
`edifact-links.json` counts reported and asserted in dataset specs;
website build + tests.

## Beats

Their source analysis reduced the EDIFACT relationship to nothing; we make
the directory's central consistency claim checkable, element by element.
