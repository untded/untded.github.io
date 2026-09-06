# 03 — MDX documentation corpus

Their methodology corpus (alignment strategy, code-list strategy,
vocabulary register, migration ledgers) is the most credible part of
vocab-bsp. We answer with a documentation corpus built in MDX inside the
existing Astro build — no new toolchain, same deploy, same search.

## Work

- Add `@astrojs/mdx` integration; `src/content/docs/` collection.
- Pages (each MDX, factual, provenance-cited):
  - `ontology.mdx` — guide to the model from 01/02, with examples.
  - `alignment-edifact.mdx` — TDED ↔ UN/EDIFACT (EDED/UNCL) relationship
    as the publication itself states it (front matter: consistency with
    the EDIFACT directories), plus our crosslink method.
  - `vocabulary-register.mdx` — the external vocabularies we reference:
    ISO 7372, ISO 6422 (UNLK), ISO 3535, UN/EDIFACT D05B, ISO 11179
    naming, ebXML CCTS. UNTP appears as an interop target only.
  - `provenance.mdx` — how the digitization was made: text-layer
    extraction, join rules, tesseract/vision verification, review queue
    policy. The method is our differentiator; document it.
  - `contributing.mdx` — the lightweight DMR: GitHub issue templates
    (correction request, new edition), what happens next.
- Nav entry "Docs", omnibox coverage, sitemap.

## Verification

- Contracts: each page built and present in the sitemap; nav link; no
  dead internal links (lychee internal mode already covers).
- Review pass on copy: plain register, no process language.

## Beats

Their methodology is about migrating BSP into a new vocabulary; ours
documents the real directory, its standards environment, and a verifiable
extraction method — the thing only the mandated registry can say.
