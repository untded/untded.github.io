# 13 — Improvement pass: ontology, design, architecture

User-driven: "fully define the ontology and classes" (learn from isq-smart);
"method page is in-progress stuff"; /frontend-design + architecture review.

- [x] Ontology: categories are first-class resources (/categories/N IRI,
      utd:Category, skos:inScheme CategoryScheme, position, tagRange,
      elementCount); elements link via utd:category; graph declares
      3 rdfs:Class + 15 rdf:Property (self-describing) — 1533 nodes
- [x] /method removed everywhere; internal chatter swept (npm-run text,
      bin/export, glyph-analysis links); provenance card = "Source" +
      "Transcription confidence"
- [x] Design: disciplined dark mode (token flip, UN blue constant, panel
      token, logos on constant plates), Pagefind UI themed, print styles,
      home "Try:" chips wired to the omnibox, category composition bars
      (add/chg/ret), BreadcrumbList on element pages
- [x] UX: directory renders 120 rows + "Show all"; unified copy buttons
- [x] Architecture: src/data/categories.json = single category source
      (site lib + build seam both read it, lazily via cwd — bundled chunks
      break import.meta.url paths); notation counts derived from data
      (no hardcoded tallies); ElementPager component; merged imports;
      per-category groups in meta + spec
