# 02 — The /ontology page

A first-class page presenting the model: classes, properties, prefixes,
examples, downloads. vocab-bsp resolves BSP terms; nobody explains TDED's
own model. Generated, not hand-maintained. Branch: `wave2-pages`.

## Tasks

- [x] `src/lib/vocabulary.ts` — loader for `data-source/vocabulary.json`
  (meta.mjs pattern: read at build time, typed).
- [x] `src/pages/ontology.astro`:
  - [x] intro: what the ontology covers, namespace IRI, edition pinning
  - [x] prefix table (from the JSON)
  - [x] classes table: term, IRI, comment
  - [x] properties tables grouped as in the declaration (element-level,
        category-level, dataset-level): term, IRI, domain, comment
  - [x] downloads block: `untded.ttl`, `untded.jsonld`, per-element RDF,
        context — same URLs the /download page serves
  - [x] worked example: element 1004's TTL excerpt (verbatim from
        `data-source/rdf/1004.ttl` if it exists in repo, else embedded)
  - [x] links: docs ontology guide (03), /download, /elements/1004
- [x] Element pages `[tag].astro`: `<link rel="alternate"
      type="text/turtle">` + `application/ld+json` to the served per-
      element `data.*` files; visible "machine formats" line in the
      provenance/sources area linking the same two URLs.
- [x] Nav: `Ontology` entry after `Notation`.
- [x] Contracts: /ontology built; contains `https://www.untded.org/ns/untded#`,
      the download links, ≥ 3 class rows and ≥ 10 property rows; element
      page carries both `rel="alternate"` links; nav `href="/ontology"`.

## Verification

Build + tests green; screenshot review light/dark; per-element RDF URLs
resolve (internal lychee).

## Beats

Their resolvable vocabulary serves BSP/UNTP terms with no TDED model page;
we document the directory's own semantics under our namespace, every claim
generated from the SSOT.
