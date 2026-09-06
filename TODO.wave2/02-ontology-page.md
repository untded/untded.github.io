# 02 — The /ontology page

A first-class page presenting the model: classes, properties, prefixes,
examples, downloads. vocab-bsp resolves BSP terms; nobody explains TDED's
own model. Generated, not hand-maintained.

## Work

- Dataset export grows `derived/vocabulary.json` — the classes, terms,
  comments and prefixes from `Untded::Vocabulary` (the single declaration);
  the website fetches it like categories.
- `/ontology` page: intro (what the ontology covers), prefix table,
  classes and properties tables (term, IRI, comment), download block
  (TTL, JSON-LD, context), a worked example (one element's TTL excerpt),
  links to docs (03) and /download.
- Element pages: `<link rel="alternate" type="text/turtle">` and
  `application/ld+json` pointing at the existing per-element `data.*`
  files; ensure the files are linked visibly too ("machine formats").

## Verification

- Contracts: /ontology built, contains the `utd:` namespace, the download
  links, ≥1 class table row; vocabulary.json drift spec (dataset) asserts
  the export matches `Untded::Vocabulary`.
- Playwright: page renders in light/dark; alternates present on
  /elements/1001.

## Beats

Their resolvable vocabulary serves BSP/UNTP terms with no TDED model page;
we document the directory's own semantics under our namespace, with every
claim generated from the SSOT.
