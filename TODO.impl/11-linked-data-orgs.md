# 11 — Linked Data outputs + organization cards + UN favicon

- [x] vocab/untded-context.yamlld in untded-2005 = semantic SSOT (YAML-LD)
- [x] bin/export emits derived/untded.jsonld + untded.ttl (rdf/json-ld gems, no hand-rolled RDF; element IRIs = live registry URLs; UNTDED_SITE_ORIGIN override)
- [x] Dataset spec: graph shape + JSON-LD/Turtle round-trip equality (untded-2005#1)
- [x] Website serves /data/untded.jsonld + /data/untded.ttl; element pages embed their JSON-LD node verbatim, home embeds the Dataset node (single semantic definition; untded.github.io#4)
- [x] Download page: JSON-LD + Turtle cards
- [x] About/governance: two org cards with logos (UNECE first, ISO/TC 154 second) — atmospheris/isq-smart layout
- [x] Favicon = UN emblem SVG (UN blue)
