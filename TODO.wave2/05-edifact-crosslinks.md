# 05 — UN/EDIFACT crosslinks

The publication's own selling point (front matter): TDED is "fully
consistent with the set of UN/EDIFACT directories". We already hold the
D05B EDED mirror and `bin/crosscheck-edifact`. Surface the join.

## Work

- Dataset: extend the graph with `rdfs:seeAlso` /
  `skos:related` from each element to the aligned EDED entry (tag-number
  join where representations and names corroborate; record join method in
  provenance).
- Export `derived/edifact-links.json` (element ↔ EDED tag ↔ aligned
  representation).
- Website: element pages show an "UN/EDIFACT" chip — "EDED 1004 · an..35"
  linking to a short docs page (03 alignment-edifact.mdx) and to the
  mirrored EDED entry where one exists on-site.
- Where the join is ambiguous (representation differs, name diverged),
  chip shows the difference, not a silent match — same policy as the
  review queue.

## Verification

- Crosscheck: `bin/crosscheck-edifact` green; counts reported in the
  export (matches / total with bridges).
- Contracts: chip present on a known-aligned element (1004); absent or
  marked-ambiguous where the join is not corroborated.

## Beats

Their source analysis reduced the EDIFACT relationship to nothing; we make
the directory's central consistency claim checkable, element by element.
