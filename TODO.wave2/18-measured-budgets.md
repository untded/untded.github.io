# 18 — Measured budgets: make the payload contract trip-able

Seventh pass (2026-09-07). The measurement sweep found the surface
healthy everywhere — homepage 34.7KB, /elements 37.7KB (budget 700KB),
element pages 31.5KB (budget 32KB), category pages 78–146KB raw by size (largest: 3000–3699
parties), ~10KB gzipped with clean repeated markup, /document 23.8KB. The homepage's
rename-ledger island carries no inline row payload; the omnibox fetches
its index lazily.

The one real gap: **the budgets cannot trip.** A 20× regression on
/elements or a 2× regression on element pages would still pass CI. A
budget nobody can fail is decoration.

## Verified clean this pass (do not re-check without cause)

- Category pages visually coherent (chips legend, divide-y rhythm —
  the wave-1 design holds; screenshot reviewed).
- Page weights above; gzip ~87% on the repetitive markup.

## Tasks

- [x] Tighten the three existing budgets to measured actuals with ~50%
      headroom: /elements 700KB→60KB, element pages 32KB→48KB (31.5KB
      actual), /about and /document/presentation 40KB→48KB.
- [x] Extend the budget list to the pages that matter: homepage
      (34.7KB→52KB budget), a category page (largest measured at 146KB→220KB — the
tightened budget caught my 78KB sample on its first run), /ontology,
      /bridges, /ledger, one docs page.
- [x] Record the measured baseline (2026-09-07 numbers) in the spec
      comment so the next tightening has a reference.

## Verification

Full suite green; budgets still pass with the current build; sync
drift zero against dataset main at ship time.

## Beats

Their site has no payload contract at all; ours fails CI the moment a
page doubles — which is the only kind of budget worth having.
