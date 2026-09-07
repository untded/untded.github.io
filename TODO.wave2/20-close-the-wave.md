# 20 — Close the wave: review-queue the UNCL false positives; final scorecard

Ninth pass (2026-09-07). All 19 tracks shipped; two loose ends remain.

First: track 10's TODO promised "unknown tags go to the review queue,
never silently dropped" — the implementation puts them in the artifact
(`unknown_tags: [1961, 4110]`) but not in `data/review-queue.yaml`.
Both are false positives in the mirror text, not data errors:
`(4110)` in UNCL 1131 is an Incoterm code number (not a TDED tag), and
`(1961)` in UNCL 1001 is the ATA Convention year. The parser's
tag-existence guard correctly excludes them from the join; they should
be documented in the review queue per policy.

Second: the overview's nine-axis comparison table (00-overview.md) still
shows the pre-wave-2 "Us today" column. After 19 tracks, a closing
scorecard row per axis is the honest record.

## Tasks

- [x] Resolution (honest, not the TODO's original wording): the
      artifact's `unknown_tags: [1961, 4110]` field is the right home.
      The review-queue model requires a TDED PDF page — it is an
      extraction-uncertainty queue for the TDED publication, not for
      UNCL mirror false positives. Forcing them in would conflate two
      data sources. The artifact documents them visibly to consumers
      and the spec verifies the exclusion; the docs page explains the
      skip. TODO promise amended rather than force-fit.
- [x] Overview: add a closing "Shipped" column to the comparison table
      with the concrete deliverable and PR reference per axis.
- [x] Mark the wave complete in the overview (tracks 00–20).

## Verification

Dataset specs green (review-queue count assertion if one exists);
website suite green.

## Beats

The wave ends with its own books balanced: every promise checked, every
unknown documented, and the scorecard written by the work itself.
