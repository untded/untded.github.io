# 14 — Dataset loader seam: one way the YAML corpus becomes elements

Second /improve-codebase-architecture pass (2026-09-07), this time over
the **Ruby repo** (the first pass covered the website). One real
candidate; the rest of the repo (Exporter's writer set, Verifier's
checks, LinkedData) already holds its shape.

The loading idiom —
`Dir.glob(File.join(dir, "elements", "*.yaml")).sort.flat_map { |p| ElementFile.from_yaml(File.read(p)).elements }` —
is hand-rolled in **13 places**: four bins (export, join-edifact,
join-uncl, crosscheck-edifact), Exporter, Verifier, OcrSampler, and five
spec files (each re-defines the same `let(:elements)`). The corpus
loading rule (sorted glob, flat-mapped files) has no single owner; a
change (new extension, subdirectory, ordering rule) would have to be
replayed thirteen times, and the specs' fixtures silently depend on the
same sorting as production.

## Tasks

- [x] `Untded.elements_from(data_dir)` in `model/untded.rb` (the
      namespace's own front door): the one definition of corpus loading.
- [x] Convert the four bins, Exporter, Verifier, OcrSampler and the five
      spec `let(:elements)` blocks to it.
- [x] Spec: loading returns 1504 elements, sorted by file then tag order
      (the same expectation `bin/verify`'s tag-order check relies on).

## Verification

Full rspec green; `bin/verify` verdicts unchanged; `bin/export`
byte-idempotent (derived/ clean after a run); website sync drift zero.

## Beats

Their Python pipeline loads its corpus ad hoc per script; ours has one
documented, tested seam for the SSOT → objects step.
