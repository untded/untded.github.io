# 02 — Data pipeline + domain lib

- [ ] scripts/sync-data.mjs — pulls derived/elements.json from ../untded-2005 (UNTDED_2005_DIR override), writes data-source/elements.json (committed)
- [ ] scripts/build-data.mjs — data-source → public/data/index.json + meta.json (pure seams in scripts/lib/, sibling specs)
- [ ] src/lib/data.ts — the only data accessor (typed: ElementRecord, loadElements)
- [ ] src/lib/element.ts — domain SSOT: change-tag labels/status, categoryOf, parseBridges, repr helpers + spec
- [ ] npm scripts: dev/build run build-data first (isotc154 pattern)

**Done when:** vitest lib specs green; index.json+meta.json generated.
