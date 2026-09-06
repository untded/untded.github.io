# 06 — Front matter: complete the source coverage

Our working copy blanks pp. 1–4 and 9–19; the document pages transcribe
from p. 20. The original PDF (21 MB, broken xref — render with `mutool`,
never `pdftoppm`) holds the front matter: foreword, introduction,
maintenance procedures. vocab-bsp has a mangled AI rendition of it; we
transcribe ours verbatim and verified. Never copy from their file.

## Work

- Render pp. 9–19 from `~/src/isoiecjtc5/untded/UNTDED2005.pdf` at 300–600
  dpi (`mutool draw`), OCR with tesseract, then vision-model verification
  per page (same discipline as section 4).
- Map the printed sections to /document subpages (introduction,
  maintenance) — extend the existing sections, keep N-numbered provenance
  (PDF page) on every block.
- Section-by-section coverage check before shipping: every heading in
  pp. 9–19 appears in the output; anything out of scope is flagged to the
  user first (transcription rule).
- Update /document index cards to the new page ranges.

## Verification

- Contracts: each new page built; spot assertions on distinctive strings
  (e.g. the DMR procedure sentence, the Maintenance Agency composition).
- Glyph-level spot check on low-confidence lines against 600 dpi renders;
  uncertain passages go to review-queue.yaml, never guessed.

## Beats

Completeness: the registry then carries the complete original text —
front matter to element directory — verbatim, provenance-tagged, which no
other digital edition of TDED has, authorized or not.
