# 06 — Source coverage: audit and complete

Working copy blanks pp. 1–4 and 9–19; sections 1–4 are already transcribed
on /document (introduction pp. 9–13, maintenance pp. 14–18, presentation
pp. 20–27). The remaining exposure is the cover matter (pp. 1–4 of the
original) and a completeness audit of everything transcribed. Never copy
from vocab-bsp; the original PDF is the only source (render with `mutool`
— broken xref; never `pdftoppm`).

## Tasks

- [ ] Audit: render pp. 1–8 of the original at 300 dpi; classify content
      (title page, imprint/copyright, TOC, inserted note pp. 5–8 of the
      redacted copy — the note is not original content, state that once
      on /document).
- [ ] Transcribe the cover matter (pp. 1–4): title, edition statement,
      imprint, copyright, ISBN — as a "Cover" card/section on
      /document/index with per-line PDF-page provenance.
- [ ] Completeness audit of existing transcription pages: section-by-
      section — every heading in pp. 9–27 of the original appears on the
      site; list any gap, fill it or flag to the user (transcription
      rule: entire document, no silent omission).
- [ ] Coverage note on /document/index: which pages of the publication
      the site transcribes (9–27) and where the element directory itself
      lives (pp. 28–132 → /elements).
- [ ] Contracts: cover strings asserted (title, ISBN once confirmed);
      coverage note present.

## Verification

Glyph-level spot check of low-confidence lines against 600 dpi renders;
uncertain passages to `review-queue.yaml`, never guessed; coverage table
complete before ship.

## Beats

Completeness: the registry then carries the complete original text —
cover to element directory — verbatim and provenance-tagged, which no
other digital edition of TDED has, authorized or not.
