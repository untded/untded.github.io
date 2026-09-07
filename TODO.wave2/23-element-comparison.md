# 23 — Element comparison: side by side

Implementers choosing between similar elements (e.g. 3032 vs 3033,
or a clear-text vs coded pair) want them side by side. The registry
has all the data; it lacks the view.

## Tasks

- [x] `/compare/[a]/[b]` — two element pages rendered side by side:
      tag, name, description, representation, change tag, bridges,
      UNLK position, EDED chip, UNCL chip + refs. Same anatomy as the
      element page, two columns.
- [x] Navigation from element pages: a "Compare with…" link that opens
      the omnibox pre-filtered to select the second element.
- [x] Contracts: /compare/1004/1131 builds with both elements'
      content; representation and bridges from both; links back to
      each element page.

Navigation from element pages shipped (each active
 element links to its next-tag comparison). All suites green.

## Beats

Their site has no comparison; ours puts any two elements face to face
in one URL — the implementer's most common question answered.
