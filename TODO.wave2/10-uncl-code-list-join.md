# 10 — UNCL code-list join (the other half of the consistency claim)

The Foreword's central claim is that the Directory is "fully consistent
with the set of UN/EDIFACT directories … especially with the EDIFACT Data
Element Directory (EDED) **and the UN Codes Library (UNCL)**". Track 05
made the EDED half checkable element by element. The UNCL half remains:
UNCL code entries cross-reference TDED explicitly — publication section
4.1.5 quotes the UNCL rules: a qualifier code whose generic + qualified
combination equals a TDED element carries that element's tag in brackets
at the start of its description (the Vol. II sample on printed page v
shows it: `BY Buyer (3002) Party to whom merchandise and/or service is
sold`).

## Input status — BLOCKED (2026-09-06)

The join needs the official UNCL file with **full descriptions**:

- The php-edifact/edifact-data mirror (`D05B/codes.xml`) carries only the
  short code names — the bracket refs are stripped. Not usable.
- The official archive is behind the UNECE CDN's challenge (curl, browser
  UA, and headless Chrome all get 403):
  `https://service.unece.org/trade/untdid/d05b/uncl.zip` — same wall for
  D.02A. A manual browser download (≈30 seconds, a real user session)
  clears it.

**Preferred input: D.02A** — the edition the publication itself names as
its resource ("The main resources used in this revision were: UN/EDIFACT
D.02A edition …"). D.05B is acceptable as a secondary check (the EDED
crosscheck already uses D05B; the README documents the vintage caveat).

Acquisition step (user, manual): open
`https://service.unece.org/trade/untdid/d02a/uncl.zip` in a browser,
download, and drop the zip (or extracted `uncl.xml`) into
`~/src/untded/references/edifact-D02A/` alongside a provenance note
(mirror: UNECE publication, fetched <date>), matching the attribution
posture of the existing `edifact-D05B/segments.xml` mirror.

## Tasks (once the input exists)

- [ ] Dataset `model/untded/uncl_join.rb` — parse the official UNCL:
      for each code entry whose description starts with `[nnnn]` (or
      contains the `(nnnn)` form per the printed sample), extract the
      referenced TDED tag; emit `derived/uncl-links.json`:
      `{tag: [{code, code_list (data element id), name, description}]}`
      plus a summary count. Guard: referenced tags must exist in TDED;
      unknown tags go to the review queue, never silently dropped.
- [ ] `bin/join-uncl` + wiring into `bin/verify` (counts, tag closure).
- [ ] Dataset specs: real-file specs against the mirrored XML (skip if the
      mirror is absent, like edifact_join_spec); known cases from the
      Vol. II sample (3035 BY → 3002) asserted once available.
- [ ] `npm run sync-data` copies `uncl-links.json`; website loader.
- [ ] Element pages: a "Referenced by UNCL code values" block for tags
      with entries (code, code list, name — collapsed if long, linking to
      a per-tag listing or the docs page).
- [ ] `docs/alignment-edifact.mdx` gains the UNCL half (or a sibling
      `docs/alignment-uncl.mdx`): what 4.1.5 states, the join method,
      coverage stats, and the vintage caveat.
- [ ] Contracts: chip/block present on a known joined tag; absent on a
      tag with no UNCL references; docs page cross-linked.

## Verification

`bin/verify` + rspec green; sync drift zero; website suite green; live
spot check of the joined element page.

## Beats

Their extraction reduced the UNCL relationship to nothing and their BSP
vocabulary re-invents code lists as SKOS; this surfaces the publication's
own bidirectional code references, element by element, from the official
source — the deepest interoperability claim in the book, made checkable.
