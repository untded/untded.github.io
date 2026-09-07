# 16 — Closed-vocabulary contract on the RDF graph

Third /improve-codebase-architecture pass (2026-09-07). Verified-clean
this pass (recorded so future reviews don't re-check): dereferenceable
artifacts serve correct content types (`text/turtle; charset=utf-8`,
`application/ld+json` — GitHub Pages maps the extensions); the 404 page
already suggests the registry surface; the extractor's deep module and
the wave-1 island seams hold their shape (deletion tests fail).

The real gap: nothing guarantees the graph only uses **declared**
terms. The vocabulary self-declares (ontology nodes, context), and the
/ontology page renders it — but if `LinkedData` emits a predicate that
isn't in `Vocabulary::TERMS`, the ontology page silently under-reports
what the graph says. The declaration and the emission can drift with no
red test.

## Tasks

- [ ] Dataset spec (extend the round-trip in linked_data_spec.rb): parse
      the generated Turtle; collect every predicate and every `rdf:type`
      object; assert each is either
      `https://www.untded.org/ns/untded#<declared term>` (TERMS ∪
      CLASSES) or inside a declared external namespace (schema:, dct:,
      skos:, rdfs:, owl:, rdf:, xsd: — exactly the PREFIXES set).
      One-sided drift — a new emission without a declaration, or a
      dropped declaration still emitted — fails the suite.
- [ ] Symmetry: every utd: class/term the declaration carries is
      actually used by the graph (dead declarations surface too).

## Verification

Full rspec green; red-check by temporarily emitting an undeclared
predicate (fails), restored.

## Beats

Their vocabulary is hand-minted Turtle with no closed-world claim; ours
carries a tested contract: what the ontology page lists is exactly what
the graph says — no more, no less.
