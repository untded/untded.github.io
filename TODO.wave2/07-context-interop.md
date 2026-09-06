# 07 — JSON-LD context and interop

vocab-bsp's strongest artifact is its mappings/: proof that UNTP/UNVTD
credentials can re-point `@context` at their vocabulary. We publish the
TDED context from our mandate position — no federation, just clean
consumption of our terms. Branch: dataset export already ships the
context; website routing + docs land in `wave2-pages`/`wave2-docs`.

## Tasks

- [x] Serve the generated context at a stable URL. Constraint: GitHub
      Pages cannot content-negotiate; serve the generated JSON-LD context
      (dataset `vocab/untded-context.yamlld` → JSON) at
      `/ns/untded-context.jsonld` (public/ copy in sync-data; JSON-LD
      1.1 processors accept remote contexts in JSON syntax).
- [x] `docs/context.mdx` (03): what the context covers, how to reference
      TDED elements from JSON-LD, edition pinning policy (context pinned
      per edition; the 2005 context never changes terms).
- [x] Two worked examples, both valid JSON-LD against the real context:
  - [x] an UN/EDIFACT-adjacent consumer citing EDED↔TDED alignment;
  - [x] a product-passport-shaped payload citing data elements by IRI
        (interop example; no endorsement of external vocabularies).
- [x] Spec: parse both examples with the served context (Node, in the
      vitest suite — `jsonld` playground-free; use a minimal expansion
      check or embed expected expanded output).
- [x] Contracts: `/ns/untded-context.jsonld` served byte-identical to the
      dataset export; /ontology and /download link it.

## Verification

Context URL resolves with correct content; examples validate; dataset
drift spec already pins context ↔ Vocabulary declaration.

## Beats

Their context serves their invented BSP reconciliation; ours serves the
directory itself, generated from the SSOT, under the organization the
resolution names.
