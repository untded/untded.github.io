# 17 — The omnibox knows the registry; an accessibility floor

Fourth /frontend-design pass (2026-09-07). Two real gaps, one floor:

1. **⌘K is blind to everything but elements.** The omnibox matches tag
   and name; typing "ontology", "ledger", "provenance" or "unlk"
   returns nothing. After the front-door pass (track 15) the surface is
   discoverable — but the power affordance, the one the homepage
   teaches first ("Press ⌘K to search"), doesn't reach it.
2. **No accessibility floor contract.** Individual pages were checked by
   hand as they shipped; nothing prevents a regression — a second h1, a
   skipped heading level, a nameless interactive control — from landing
   green.

Verified-clean this pass: content types on the RDF artifacts; the 404
page's route suggestions; dark-mode tables and global :focus-visible
(tracks 13/15).

## Tasks

- [x] `src/lib/omnibox-filter.ts`: page results — a typed static list
      (route, title, keywords) for the twelve registry pages
      (/ontology, /ledger, /bridges, /unlk, /document, /docs + the
      guides); matched by normalized title/keyword, ranked below exact
      tag hits and above substring name hits; returned alongside rows.
- [x] `Omnibox.vue`: two result sections ("Elements" / "Pages"),
      keyboard navigation unchanged (arrows move through the merged,
      ordered list; Enter follows).
- [x] Specs: page results for "ontology", "unlk", "prov*"; a tag query
      still ranks the element first; empty query returns nothing.
- [x] Accessibility floor spec (dist-based, no new dependencies): every
      built page has exactly one `<h1>`; heading levels never skip
      (h1→h3); every `<button>`/`<a>` has an accessible name
      (text or aria-label); every `<svg>` in content has role or
      aria-label or is `aria-hidden`.
- [x] Fix whatever the floor finds (expected: small).

## Verification

Build + suites + links; headless drive of ⌘K ("ontology" → Enter →
/ontology; arrows traverse both sections); screenshots of the omnibox
with mixed results.

## Beats

Their site has no omnibox; ours reaches the whole registry from any
page in two keystrokes — and the floor keeps the instrument usable for
screen-reader and keyboard users, permanently.
