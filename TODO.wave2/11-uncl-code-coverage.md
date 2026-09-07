# 11 — UNCL code-list coverage from the D05B mirror

Track 10's full join (the section-4.1.5 bracket cross-references) needs the
official UNCL file, which is CDN-blocked. But the already-mirrored UNCL
D05B code list (php-edifact `codes.xml`, the same provenance as
`segments.xml`) carries every code value keyed by data element — short
names, no descriptions. That yields the coverage half now: which TDED
elements are code-qualified in UN/EDIFACT, and with how many values.
Numbers (computed 2026-09-07): 268 coded data elements, 10,169 code
values, of which 257 exist in TDED (e.g. 3055 → 316 values, 3035 → 559,
1229 → 112); 11 mirror ids are not TDED elements (service/other) and are
filtered out.

Same architecture as track 05: the join ships as its own artifact; the
main RDF graph stays mirror-independent (deterministic builds).

## Tasks — references repo

- [x] Fetch `D05B/codes.xml` from the php-edifact/edifact-data mirror
      into `edifact-D05B/codes.xml`; record provenance in the README
      alongside the segments.xml mirror (UNECE publication, php-edifact
      mirror, fetch date).

## Tasks — dataset repo

- [x] `model/untded/uncl_coverage.rb` — REXML parse (edifact_join
      pattern, no new deps): `counts(xml_path)` → `{tag => n_code_values}`;
      `links(elements, counts)` → joined records for tags present in TDED.
- [x] `bin/join-uncl` → `derived/uncl-coverage.json`:
      `[{tag, code_values}]`, plus a one-line summary (elements, values,
      skipped non-TDED ids).
- [x] Spec `uncl_coverage_spec.rb` (skip if the mirror is absent — real
      files): 3055 → 316 values; 1004 not coded; every joined tag exists
      in the element set.
- [x] README: vintage caveat (D05B vs the edition's D.02A resource —
      same note as the EDED crosscheck) and the artifact line.

## Tasks — website repo

- [x] `npm run sync-data` copies `uncl-coverage.json`; `src/lib/uncl.ts`
      loader.
- [x] Element pages: beside the EDED chip, a `UNCL D05B · N code values`
      chip when the element is coded (links to the alignment doc's UNCL
      section; title attribute carries the meaning); absent otherwise.
- [x] `docs/alignment-edifact.mdx` gains the "Code lists (UNCL)" section
      (anchor `uncl`): what the coverage means, the method, the mirror
      and vintage caveats, and that the full 4.1.5 bracket references
      await the official UNCL file (track 10).
- [x] Contracts: chip + count on /elements/3055; absent on /elements/1004;
      docs anchor present; artifact listed on /download.

## Verification

Dataset rspec + `bin/join-uncl` counts; sync drift zero; website build +
tests + links; live spot check of /elements/3055 and /elements/1004.

Shipped 2026-09-07: references PR #1 (codes.xml mirror), dataset PR #9
(uncl_coverage.rb + bin/join-uncl + spec, 56 examples), website PR (chip,
docs section `code-lists-uncl`, download card, contracts; 97 tests).
Run counts: 256 coded active elements, 10,104 code values, 11 D05B-only
ids skipped.

## Beats

Their BSP vocabulary re-invents code lists as opaque SKOS concepts; this
tells implementers, on the element page itself, that a field is
code-qualified in the live UN/EDIFACT directory and how many values it
carries — straight from the official publication's mirror, counted by
our pipeline.
