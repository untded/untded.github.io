# Wave 2 — Outcompete vocab-bsp on every axis

Reference point: the unauthorized UNICC repo `un/unece/uncefact/vocab-bsp`
(local read-only clone: `~/src/unicc/vocab-bsp`) — Steve Capell's Turtle+SKOS
"Vocab" with our directory among its "source analyses". Comparison verdict
(2026-09-06, verified against the PDF text layer): their TDED extraction
loses 44 rows, carries 39 wrong representations and mangled names,
descriptions and bridges. We hold the mandate (ISO/TC 154 N1727) and the
better data. Wave 2 makes that visible in every dimension where they
operate.

| Axis | vocab-bsp | Us today | Wave 2 deliverable |
|---|---|---|---|
| Data quality | 1460 rows, lossy | 1504, verified | keep: closure specs, `bin/verify` |
| Semantics | TDED is a markdown table | JSON-LD/Turtle, flat literals | structured ontology (01) |
| Vocabulary resolution | per-term URIs, S3/CF | per-element `data.ttl`/`data.jsonld` | `/ontology` + alternates (02) |
| Documentation | Nextra site, methodology corpus | site + transcribed document | MDX docs corpus (03) |
| Edition history | (none for TDED) | change tags in data | 1993↔2005 ledger (04) |
| UN/EDIFACT linkage | none | D05B mirror + crosscheck | element-level crosslinks (05) |
| Source coverage | mangled front-matter prose | sections 4.x only | verified pp. 9–19 (06) |
| Context/interop | UNTP/UNVTD @context mappings | generated context | context guide + examples (07) |
| Visual exploration | static clickable diagrams | UNLK interactive explorer | bridges-by-scheme map (08) |

Principles (standing):

1. Ruby-only dataset pipeline; YAML is the SSOT; TTL/JSON-LD/HTML/MDX-data
   are derived, one writer each. Never hand-edit derived artifacts.
2. Documentation in MDX inside the existing Astro build — no new toolchain.
3. Never consume vocab-bsp content as input. Anything they have that we
   want, we derive from our own sources and verify.
4. Plain professional register; facts carry provenance; the mandate
   (N1727) is stated, not shouted.
5. Every deliverable ships with contracts/specs in the same PR; PRs,
   never direct-to-main.

Execution order: 01 → 02 → 03 are the spine (ontology, its page, the docs
corpus). 04–08 are independent and can interleave.
