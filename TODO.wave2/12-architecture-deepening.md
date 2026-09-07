# 12 — Architecture deepening: pure domain core, one data seam, parser parity

/improve-codebase-architecture pass over the post-wave-2 surface
(2026-09-07; report:
`$TMPDIR/architecture-review-20260907-untded.html`). Three candidates
accepted, two rejected — the rejections are recorded at the bottom so
future reviews don't re-litigate them. All were pre-authorized for
implementation.

## A — Pure the domain core (element.ts loses node:fs) · Strong

The client graph is polluted: UnlkExplorer's browser `<script>` imports
`lib/unlk` → `lib/element`, whose top level imports `node:fs`/`node:path`
for `loadCategories()` — Vite externalizes them with a warning on every
build, and the module is both a pure domain library and a Node loader.
Meanwhile `lib/data.ts`'s header claims "the single data seam" while one
accessor lives outside it.

- [x] Move `loadCategories()`, `categoryOf()` and the `Category` type
      from `element.ts` into `data.ts` (all callers are server-side).
- [x] `element.ts` becomes 100% pure: labels, change-tag legend, bridge
      parsing, pointers — no node imports, ever.
- [x] Contract: the build produces **zero** "externalized for browser"
      warnings mentioning `lib/element` (assert on the build log), and
      `grep -L "node:fs" src/lib/element.ts` holds by review.

## B — One loader seam (loadJson in data.ts) · Worth exploring

Four modules hand-roll
`readFileSync(resolve(process.cwd(), 'data-source/X.json'))` — the
cwd workaround (needed because the bundled prerender entry breaks
`import.meta.url` paths) is duplicated and each loader invents its own
missing-file behavior.

- [x] Export `loadJson<T>(file: string)` from `data.ts`; convert
      `edifact.ts`, `uncl.ts`, `vocabulary.ts` and `data.ts`'s own reads
      to it. One cwd resolution, one error mode, typed per-artifact
      wrappers on top.
- [x] Specs still green (`edifact`/`uncl` loaders keep their contracts).

## C — Cross-repo parser parity contract (Ruby ⇄ TS) · Strong

The bridge / replacement / UNLK-zone parsers exist twice — Ruby feeds
the RDF graph, TypeScript renders the pages. They drifted once for real
(element 5010's colon-less print, fixed in both on 2026-09-06); nothing
fails today if they drift again.

- [x] Dataset: `bin/export` also writes `derived/parser-fixtures.json` —
      for a fixed sample of real tags (incl. 5010, 1004, 1128, 1188 and
      every edge case the Ruby specs pin), the raw bridges strings and
      the Ruby-parsed structures (scheme entries, segments, UNLK zones,
      replacement pointers).
- [x] `npm run sync-data` copies the fixtures; a website spec runs the
      TS parsers over every fixture input and asserts identical
      structures — one-sided drift is a red test at the next sync.
- [x] Dataset specs pin the fixture file to the YAML (no drift there
      either).

## Rejected (do not re-suggest without new evidence)

- Splitting `site-contracts.pages.spec.ts` — churn is "every feature
  adds a contract here", and a split moves lines without concentrating
  complexity (deletion test fails).
- Category SSOT — verified clean (`data-source/categories.json`, single
  writer via sync); the stale memory about `src/data/categories.json`
  is corrected.

## Verification

A: build log free of the externalization warning; suites green.
B: suites green. C: parity spec red when a parser is perturbed
(checked locally once), green on real fixtures; dataset rspec green.

Shipped 2026-09-07: dataset untded-2005#10 (fixtures export, 57
examples); website PR (A+B+C-website) — 105 tests, build free of the
externalization warning, red-check performed (one renamed scheme fails
5/8 parity cases, restored). Report opened from
$TMPDIR/architecture-review-20260907-untded.html.

## Beats

Their pipeline is one language and one writer; ours deliberately runs
two — which only works if the seam between them is contractual. The
parity fixtures make "what the printed source means" a tested fact on
both sides, and the pure core keeps the client bundle provably clean.
