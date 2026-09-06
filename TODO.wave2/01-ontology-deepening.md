# 01 — Ontology deepening (dataset repo)

Turn the flat literals of the Linked Data graph into typed, queryable
semantics. vocab-bsp's TDED is a markdown table; ours becomes a real
ontology.

## Work (untded-2005, Ruby + rdf gems only)

- Port the UNLK zone parser from the website (`src/lib/unlk.ts`) into the
  dataset as `Untded::UnlkZones` — one writer. The website then consumes
  structured zones from the export instead of re-parsing bridge strings.
- `utd:representation` structured node per element: `charset`, `minLength`,
  `maxLength`, plus the raw printed form.
- Bridges → one `utd:Bridge` node per scheme with `utd:scheme`
  (UNLK/MAR/CIMP/SAD/AWB/CIM/CMR/UNLK…) and `utd:detail`; UNLK bridges get
  zones: `lineFrom`, `lineTo`, `posFrom`, `posTo`, `format`.
- Retired elements: parse "DE to use instead - nnnn" notes into
  `utd:replacedBy` typed links (element-level graph of the 1993→2005
  migration).
- `skos:altLabel` from old_name and business_term; `utd:changeTag`,
  `utd:status` exposed.
- Declare all new terms once in `Untded::Vocabulary` (context and ontology
  nodes keep deriving from it).

## Verification

- Round-trip spec: parse the generated TTL back with rdf-turtle; 1504
  element subjects; every element has prefLabel, definition,
  representation; category totals sum to 1504.
- Closure invariants: every `utd:replacedBy` target exists; every UNLK
  zone within lines 1–33 and positions 1–82; bridge schemes ⊆ the known
  set from the publication.
- `bin/verify` extended with the new invariants; existing pipeline green.

## Beats

Their TDED rows are mangled strings in a table; after this, "give me every
element located on UNLK line 4" or "the full replacement graph of the 2005
revision" is one query against our TTL.
