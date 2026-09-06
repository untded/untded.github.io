# 06 — Source coverage: audit and complete

Working copy blanks pp. 1–4 and 9–19; sections 1–4 are already transcribed
on /document (introduction pp. 9–13, maintenance pp. 14–18, presentation
pp. 20–27). The remaining exposure is the cover matter (pp. 1–4 of the
original) and a completeness audit of everything transcribed. Never copy
from vocab-bsp; the original PDF is the only source (render with `mutool`
— broken xref; never `pdftoppm`).

Premise corrected during the audit (2026-09-06): the redacted working
copy's pp. 5–8 are NOT "one identical inserted note" — p. 5 carries the
Volumes II/III note and pp. 6–8 carry the complete Foreword (printed
pages vi–viii), with a text layer. The Foreword was therefore never lost,
only untranscribed on the site.

## Tasks

- [x] Audit: render pp. 1–8 of the original at 300 dpi; classify content
      (cover p. 1, imprint p. 2, contents pp. 3–4, Volumes II/III note
      p. 5, Foreword pp. 6–8). Two OCR passes (300 + 600 dpi) reconciled;
      glyph checks resolved the URL colon, the logo order (UN left, ISO
      right), `(ISO6422)`, `(cc TAC,` and `9170037`. No ISBN or copyright
      line exists in the edition — stated on /document.
- [x] Transcribe the cover matter (pp. 1–4): Cover and imprint card on
      /document/index — title, edition statements, ECE/TRADE/362,
      publisher/year; contents pp. 3–4 become the coverage table.
- [x] Foreword (pp. 6–8) transcribed as /document/foreword — verbatim,
      sourced from the working copy text layer, verified against the
      scans; includes the Acknowledgment.
- [x] Completeness audit of existing transcription pages — found and
      filled: definitions 1.3.5–1.3.8 and section 1.8 on the introduction
      page (with the (1)/(2) footnotes and the verbatim 1.6 heading);
      on the maintenance page sections 2.2, 2.3.2, 2.3.3, 2.4.1, 2.4.2
      lead, 2.4.3, 2.5, 2.6, 2.7 and the full 2.3.1 body list (14
      entries), and restored the verbatim headings (2.3 Membership,
      2.4 Rules of procedure, 2.4.2 Changes to TDED, numbered
      2.4.2.1–2.4.2.2). Presentation page (4.1–4.1.7) was already
      complete.
- [x] Coverage note on /document/index: page-by-page table, PDF pp. 1–132
      (element table starts PDF p. 28, printed p. 20 — verified).
- [x] Contracts: cover strings, foreword strings, and every restored
      heading asserted in site-contracts.pages.spec.ts.

## Verification

Glyph-level spot check of low-confidence lines against 600 dpi renders
(URL colon, ISO6422, cc TAC, fax number); build + 93 tests + links green;
screenshots of /document, /document/foreword, /document/maintenance
reviewed.

## Beats

Completeness: the registry then carries the complete original text —
cover to element directory — verbatim and provenance-tagged, which no
other digital edition of TDED has, authorized or not.
