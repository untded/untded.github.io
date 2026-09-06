# 09 — Repair the search surface; complete the download page

Discovered in the 2026-09-06 close-out sweep: the full-text search page has
never actually worked in production. Its mount script is emitted inline
(`data-astro-rerun`) — a classic script — and uses top-level `await`, which
is a `SyntaxError` in that context. The browser discards the script, the
Pagefind UI never mounts, and the page silently shows nothing (the catch
never runs either — the script never parsed). A second, independent
bug sat underneath it: `pagefind-ui.js` attaches itself to
`window.PagefindUI` and exports nothing, so the destructured import was
`undefined` and the constructor threw even once the script parsed. Both
fixed. The wave-1 contract only
asserted that the pagefind *index* exists, not that the UI mounts, so the
suite stayed green.

The same sweep found two smaller gaps: /download does not list the wave-2
machine artifacts, and nothing pins the per-element inline `@context`
against the served `/ns` context (today they are byte-for-byte equal in
semantics — 56 terms, no diffs — but a contract should keep them so).

## Tasks

- [x] `src/pages/search.astro` — wrap the mount script in an async IIFE so
      it is valid both as an inline classic script and as a bundled module;
      keep `data-astro-rerun` (view-transition re-mount) and the
      `/* @vite-ignore */` dynamic imports (runtime `/pagefind/` paths).
- [x] Bug-class sweep: no other `data-astro-rerun` script uses top-level
      await (checked 2026-09-06: SiteHeader, 404, index are clean) — keep
      it that way; verify with a grep contract over `dist/`.
- [x] Search page copy: the index now covers the whole site, not only
      element entries — adjust the description line.
- [x] `src/pages/download.astro` — list every machine artifact with its
      URL: `/data/index.json`, `/data/untded.{jsonld,ttl}`,
      `/data/vocabulary.json`, `/data/edifact-links.json`,
      `/ns/untded-context.jsonld`, per-element
      `/elements/<tag>/data.{ttl,jsonld}`; note the dataset repo as the
      source of truth for regeneration.
- [x] Contracts:
  - search: the mount script contains the async IIFE (regression tripwire
    for the top-level-await bug class); grep contract: no
    `data-astro-rerun` inline script in dist contains an unindented
    top-level `await`.
  - download: every artifact URL present.
  - context equivalence: parse `data-source/rdf/1004.jsonld`'s inline
    `@context` and `data-source/context.jsonld`; assert identical term
    sets and mappings.

## Verification

Build + tests + links; then browser-level: load the deployed /search, type
a docs-only term (e.g. “provenance”) and an element term (e.g. “invoice”),
assert result links from both corpora; pageerror-free load. The functional
check is manual (headless) — CI keeps the static tripwires.

Functional results after the fix (2026-09-06, headless against a fresh
build): "provenance" → /docs/provenance/ + sub-results; "foreword" →
/document/foreword/; "voting" → /document/maintenance/; "invoice" →
element pages; "ISO 6422" → /unlk + /elements/6422. Zero page errors.
Note: the current pagefind ships the legacy UI on window (the build
suggests the Component UI); the embedded legacy UI still fits the page
design — revisit if pagefind drops it.

## Beats

vocab-bsp's Nextra site ships working search out of the box; ours shipped a
search page that never mounted. This fixes the registry's most basic
discovery affordance and pins the contract so it cannot silently regress.
