# 18 — Architecture deepening + theme persistence + copy register

Implements the six candidates of the architecture review
(2026-09-06, report in $TMPDIR) plus two user-reported bugs and a copy
register fix. "Do all of them."

## Dataset (untded/untded-2005 PR #6)

1. **Vocabulary declared once** — `Untded::Vocabulary`
   (model/untded/vocabulary.rb): namespace, prefixes, classes, terms
   (group/iri/domain/comment). The context file
   `vocab/untded-context.yamlld` and the graph's ontology nodes are
   generated from it; spec enforces the committed file == regenerated.
2. **Categories structured once** — `Untded::CATEGORIES`
   (model/untded/categories.rb); Extractor headers, Linked Data nodes
   and the new `derived/categories.json` derive from it (regex
   re-parse deleted).
3. **Closure contract** — used utd: terms ⊆ declared (rdf:Property /
   rdfs:Class) replaces the magic counts (1532 / 15 / 3).
4. **Exporter cleanup** — `derived/index.html` retired (zero
   consumers); `name_fr`/`code_list` dropped (0 of 1504; CodeList
   model deleted; CSV columns and website ElementRecord fields gone).
5. **bin/* Bundler-proof** — `ENV["BUNDLE_GEMFILE"]` + `bundler/setup`
   in all five scripts; bare invocation works.
6. `CONTEXT.md` domain glossary; README updated (declaration, generated
   context, /method reference removed).

## Website (this PR)

- **Fresh-by-construction tests** (candidate 2) — vitest `globalSetup`
  (scripts/test-global-setup.mjs) rebuilds when any input
  (src/scripts/data-source/public/configs) is newer than dist/. The
  stale-dist false-green that shipped this morning is now impossible.
- **Generated categories** (candidate 3) — reads
  `data-source/categories.json` (dataset-written); hand-maintained
  `src/data/categories.json` deleted. Labels are the source's own
  section titles (the hand copy had drifted: "Measures, quantities" vs
  "Measure identifiers, quantities (other than monetary)").
  Display-capitalisation at load; category pages cite "section 4.2.x".
  Coverage contract: nine ranges partition all element tags.
- **Closure contract** (candidate 4) — replaces `+28`/`14`/`3`.
- **Quick wins** — `elementUrl` routes through `href()`;
  `sourcePdfUrl()` in site.ts is the single PDF deep-link helper;
  noscript table uses `categoryOf().range` not `Math.floor`.
- **Theme persistence** (bug) — ClientRouter swaps the document element
  and drops the html class the no-flash script set; the theme is
  re-applied on `astro:after-swap`. Contract asserts the listener.
- **Whitespace audit** (bug) — full dist scan (tag-adjacency both
  directions incl. span/sup/etc., word-join, punctuation-join): current
  output clean; the only intentional no-space pattern is the UN/TDED
  slash. Contract broadened to the full inline-tag set with the slash
  neutralised.
- **Copy register** (user corrections) — "The wordmark" section
  rewritten as plain "Name and colours"; "One slash, the whole
  standards family. Keep reading." and "the renaming, live from the
  ledger" deleted/rewritten; fabricated governance sentences ("The
  United Nations leads. Hosting and code are provided by the untded
  open-source organization.") deleted; class `wordmark-slash` renamed
  `name-slash`.
- `CONTEXT.md` + CLAUDE.md updated.

## Verified

- Dataset: 32 examples green; export behavior-identical (1532/14/3);
  bare bin/export works.
- Website: 61 tests green; no-dist `npm test` rebuilds then passes;
  lychee 0 errors; category page shows source labels + section.
