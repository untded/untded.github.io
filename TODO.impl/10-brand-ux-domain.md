# 10 — UN/TDED rebrand, JSX whitespace fixes, UX pass, custom domain

User-driven corrections (2026-09-05):

- [x] Wordmark is UN/TDED (UN-family slash convention: UN/CEFACT, UN/EDIFACT), not a stylized "unt·ded" — header, footer, about etymology, page titles, docs
- [x] Fix all JSX text/element whitespace collapses (4,580 instances in built HTML); add a dist-based regression contract that fails on any recurrence
- [x] Remove strikethrough from 1993 names (element page + ledger) — history, not deletion
- [x] Plain-language home trust card + download cards (no internal jargon like "single source of truth" on the public site)
- [x] Drop P-2026-10 from the mandate section (JTC 5 liaison appointments are not part of this mandate)
- [x] Element pages: prev/next navigation, even/odd text–coded counterpart link, copy-tag button
- [x] Directory: sort control (tag/name, both directions, unnamed last); mobile overflow scroll
- [x] Category ramp used decoratively only (dots/bars) — contrast-safe text
- [x] No hardcoded hostnames: src/lib/site.ts URL config SSOT + base-aware href() everywhere (root and sub-path deploys differ); contracts read site from astro.config.mjs
- [x] RenameLedger pauses on hover/focus
- [x] Custom domain: public/CNAME + astro.config site = https://www.untded.org
