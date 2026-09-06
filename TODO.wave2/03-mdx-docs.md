# 03 — MDX documentation corpus

Their methodology corpus (alignment strategy, code-list strategy,
vocabulary register, migration ledgers) is the most credible part of
vocab-bsp. We answer with a documentation corpus built in MDX inside the
existing Astro build — no new toolchain, same deploy, same search.
Branch: `wave2-docs`.

## Tasks

- [x] `@astrojs/mdx` integration in `astro.config.mjs` (Astro-native; the
      only new package).
- [x] Shared docs layout `src/layouts/DocsLayout.astro` (BaseLayout +
      prose styling, left ToC on wide screens, consistent with site look).
- [x] Pages (MDX under `src/pages/docs/`):
  - [x] `docs/index.mdx` — what the corpus covers
  - [x] `docs/ontology.mdx` — guide to the model from 01/02 with TTL and
        JSON-LD examples
  - [x] `docs/alignment-edifact.mdx` — TDED ↔ UN/EDIFACT as the
        publication states it (front matter: fully consistent with the
        EDIFACT directories, EDED/UNCL cross-references), our join method
        and its limits (segments.xml mirror covers only elements
        referenced by segments)
  - [x] `docs/vocabulary-register.mdx` — external vocabularies we
        reference: ISO 7372, ISO 6422 (UNLK), ISO 3535, UN/EDIFACT D.05B,
        ISO 11179 naming, ebXML CCTS; UNTP as interop target only
  - [x] `docs/provenance.mdx` — the extraction method: text-layer
        extraction, hyphen-join rules, tesseract + vision verification,
        review-queue policy, confidence semantics
  - [x] `docs/context.mdx` — from 07: JSON-LD context guide + examples
  - [x] `docs/contributing.mdx` — the lightweight DMR: GitHub issue
        templates (correction request, new edition), response path
- [x] `.github/ISSUE_TEMPLATE/` — correction + new-edition templates.
- [x] Nav: `Docs` entry after `Document`; docs pages cross-linked from
      /ontology, /notation, /download, footer.
- [x] Contracts: every docs page built + in sitemap; nav link; no
      unexplained gaps between TOC anchors.

## Verification

Build + tests; copy review pass (no process language, no invention);
screenshot of one docs page light/dark.

## Beats

Their methodology is about migrating BSP into a new vocabulary; ours
documents the real directory, its standards environment, and a verifiable
extraction method — the thing only the mandated registry can say.
