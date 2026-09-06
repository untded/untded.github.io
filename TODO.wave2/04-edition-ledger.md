# 04 — Edition ledger: 1993 ↔ 2005

The publication's change tags are an edition-migration ledger in embryo —
every row carries what changed against the 1993 edition. We hold them for
all 1504 elements; nobody has ever made them browsable.

## Work

- Dataset: export `derived/ledger.json` — per change tag (`cnd`, `add`,
  `x`, `cndr`, `u`), the elements and counts; retired rows joined with
  their replacement targets (from 01's `replacedBy` parsing).
- Website `/ledger` page:
  - summary strip: 1504 elements → added / changed / changed+retired /
    retired / undeleted counts;
  - per-category breakdown;
  - the replacement graph as a list: retired tag → use-instead tag
    (linked element pages);
  - cross-link from ChangeTagBadge on element pages to the ledger anchor.
- Copy: define each tag in the legend exactly as the publication prints it
  (section 4.1), including the two outside-legend tags from the review
  queue.

## Verification

- Contracts: /ledger built; counts sum to 1504; every retired element with
  a parsed replacement shows exactly one target link; badge links present.
- Dataset spec: ledger export matches element data (no drift).

## Beats

vocab-bsp's migration ledger tracks their own UNSCRO rewrites; it says
nothing about TDED editions. This is the actual edition history of the
standard, generated from verified data.
