# 25 — Missing dataset specs

Two model modules have no dedicated spec file:
- `model/untded/validator.rb` (59 lines) — no spec
- `model/untded/exporter.rb` (148 lines) — only indirectly tested via
  tooling_spec and the derived-artifact checks

## Tasks

- [x] `spec/validator_spec.rb` — run the validator against the real
  YAML; assert zero errors (or the known set); perturb one element
  and assert the error is caught.
- [x] `spec/exporter_spec.rb` — run `Exporter#call` into a tmpdir;
  assert all 7 artifacts are written; assert elements.csv row count;
  assert vocabulary.json has the expected shape.

## Why

Coverage gap: a regression in the validator or exporter currently
surfaces as a bin failure, not a spec failure with a clear message.
