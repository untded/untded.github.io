# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The public registry website for the digitized UNTDED 2005 (UN Trade Data
Elements Directory = ISO 7372:2005): 1504 data elements, built and
operated on behalf of UN/CEFACT (UNECE) and ISO/TC 154 per the mandate
in ISO/TC 154 N1727 (resolutions P-2026-06/07 — see /about). Deployed to
GitHub Pages (custom domain www.untded.org) from `main` at https://untded.github.io.

## Commands

```sh
npm run sync-data   # SSOT pull from ../untded-2005 -> data-source/elements.json (commit the result)
npm run build       # build-data + astro build + pagefind  (everything regenerates)
npm test            # lib specs always; page contracts need dist/ (they skip otherwise)
npm run dev
```

## Non-negotiables

- **data-source/elements.json is the committed sync of the dataset SSOT.**
  Never hand-edit it — run `npm run sync-data` (needs the
  `~/src/untded/untded-2005` sibling with `bundle install` done).
- **`src/lib/data.ts` is the only data accessor**; display language lives
  in `src/lib/element.ts` (labels, categories, bridges, replacement
  pointers) — components never re-encode it.
- Islands are thin Vue shells over **pure seams**
  (`src/lib/directory-filter.ts`, `src/lib/omnibox-filter.ts`,
  `scripts/lib/*.mjs`) — logic goes in the seams, tests beside them.
- Theme: light/dark via .dark class + localStorage (untded-theme) + no-flash
  bootstrap in BaseLayout; keep bg-white only on logo plates.
- Perf contracts: /elements HTML budget is 60 KB (the noscript table once
  ballooned it to 490 KB). Vanilla scripts that touch the DOM need
  data-astro-rerun to survive view transitions.
- Hostnames/base paths are NEVER hardcoded: `src/lib/site.ts` is the URL
  config SSOT (`href()` for internal routes — root and sub-path deploys are
  different; `astro.config.mjs` `site` is the origin, read by contracts).
- The palette is the SSOT in `src/styles/main.css` `@theme` (UN blue
  #009EDB + cat-1..cat-9 ramp). Dynamic `cat-*` class names require the
  literal `@utility` declarations in main.css.
- Page contracts (`src/lib/site-contracts.pages.spec.ts`) run against
  `dist/`: every element route, sitemap completeness, payload budgets,
  the mandate citation on /about, retired→replacement links. Keep them
  green after any template change.
- Do not use the UN emblem or name-as-logo anywhere — attribution text
  only (see /about licensing section).
- All changes to `main` via PR; never push tags or commit to main directly.

## Gotchas

- `astro check` is not wired into CI (unstable at this page count);
  TypeScript strictness comes from the editor + vitest.
- Pagefind assets exist only after build; `/search` shows a fallback in dev.
- `import.meta.url`-relative reads break in build chunks — data paths
  resolve from `process.cwd()`.
