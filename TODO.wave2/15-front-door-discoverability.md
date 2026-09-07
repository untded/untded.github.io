# 15 — The front door: the registry's whole surface, discoverable

Third /frontend-design pass (2026-09-07). The wave-2 surface is rich —
ontology, ledger, bridges, the docs corpus, the UNLK explorer, the
transcribed publication — and the header nav carries it. But the
**home page still sells only the directory**: categories, governance,
download. A first-time visitor landing on untded.org cannot tell the
registry has an ontology page, an edition ledger, a document-systems
map, or an interactive model form. The work is shipped; the front door
hides it.

Grounding: the homepage's existing card language (border-line, bg-paper,
hover:border-un/60, `→` titles) is the kit — the new section joins it
quietly. The signature stays the ledger aesthetic; no new visual idea,
just completeness of the tour. Verified-clean this pass: dark-mode
tables (screenshot reviewed), global `:focus-visible` styling.

## Tasks

- [x] Homepage gains an "Explore the registry" section between the
      categories and the governance cards — six cards in the existing
      language: the ontology (/ontology), the 1993↔2005 ledger
      (/ledger), bridges by document system (/bridges), the UN layout
      key reconstruction (/unlk), the publication's own text
      (/document), and the documentation corpus (/docs) — one plain
      sentence each, no marketing register.
- [x] The stat strip gains one registry-wide number: document systems
      bridged (12, from the schemes set), linking /bridges — the hero
      numbers then cover data, history, and reach.
- [x] Contracts: the six routes present on /index.html; the stat strip
      carries the bridged-systems number.

## Verification

Build + tests + links; screenshot review light/dark; live check after
deploy.

## Beats

Their site's front door is their BSP vocabulary; ours opens onto the
whole instrument — data, semantics, edition history, document systems,
the model form itself, and the book — six clicks to depth, one look to
know it exists.
