# 01 — Ontology deepening (dataset repo)

Turn the flat literals of the Linked Data graph into typed, queryable
semantics. vocab-bsp's TDED is a markdown table; ours becomes a real
ontology. Branch: `wave2-ontology` in `untded/untded-2005`.

## Tasks

- [x] `model/untded/bridges.rb` — Ruby port of the website bridge parser:
  `Untded::Bridges.entries(bridges)` → `[{scheme:, detail:}]` (scheme
  regex = the publication's abbreviation list, 12 schemes) and
  `Untded::Bridges.segments(detail)` → format/lines/positions/text
  segments. Port faithfully from website `src/lib/element.ts`
  (`BRIDGE_SCHEME`, `BRIDGE_TOKEN`, `parseBridges`, `formatBridgeDetail`).
- [x] `model/untded/unlk_zones.rb` — `Untded::UnlkZones.of(bridges)` →
  array of `Struct.new(line_from, line_to, pos_from, pos_to, format)`
  (keyword `format:` optional). Port the normalization
  (`\b([LP])(\d)/` glue-split, lowercase l/p upcase, zero-clamp
  `P 00-08 → 1`) from website `src/lib/unlk.ts#unlkZones`; zones are pure
  semantics, millimetre geometry stays website-side.
- [x] `model/untded/replacement.rb` — `Untded::Replacement.of(element, tags)`:
  retired `notes` → the referenced tag, with the same guards as the
  website's `replacementPointer` (4-digit refs, not self, > 699, not
  1970–2099 year range, must exist in the tag set).
- [x] `Vocabulary` declaration grows (single writer, context + ontology
  nodes keep deriving):
  - classes: `Representation`, `Bridge`, `UnlkZone` (with comments)
  - terms: `printedForm`, `scheme`, `detail`, `zone`, `lineFrom`, `lineTo`,
    `posFrom`, `posTo`, `fieldFormat`, `replacedBy`; `altLabel`
    (skos:altLabel)
- [x] `LinkedData#element_node` restructure:
  - `representation` becomes a node: `@type Representation`,
    `printedForm`/`charset`/`minLength`/`maxLength` (flat
    charset/min/max literals move inside it)
  - `bridges` literal kept (source-verbatim) + `bridge`: one blank node
    per scheme entry (`scheme`, `detail`, and `zone*` for UNLK entries)
  - `altLabel`: old_name and business_term (when present)
  - `replacedBy`: `{"@id": .../elements/<tag>}` from `Untded::Replacement`
- [ ] Exporter grows (all under `derived/`):
  - [x] `vocabulary.json` — prefixes, classes, terms from `Vocabulary`
        (for the /ontology page; one writer)
  - [x] ~~ledger.json~~ — dropped: the site derives the ledger from
        elements.json + its own replacementPointer (one writer, no drift)
  - [x] ~~bridges.json~~ — dropped: the site derives it via parseBridges
        (same parser, ported)
  - [x] `edifact-links.json` — NEW `bin/join-edifact`: tag join against
        `references/edifact-D05B/segments.xml` (extract the join from
        `bin/crosscheck-edifact` into `model/untded/edifact_join.rb`;
        both bins call it). Records tag, EDED name, type, maxlength,
        aligned flag (representation corroboration).
- [x] `bin/verify` grows: UNLK zones within lines 1–33 / positions 1–82;
  every `replacedBy` target exists; bridge schemes ⊆ known set.
- [x] Specs (real files, no doubles):
  - [x] `bridges_spec.rb` — scheme segmentation; format/line/position
        segmentation cases from the website spec
  - [x] `unlk_zones_spec.rb` — the ported cases: `UNLK: an..17 L 04,
        P 63-80`; `L 16, P 45 - 61`; `L 36-46, P 00-08` → posFrom 1;
        `L15`; lowercase `p 74-80`; non-UNLK dropped; unlocatable dropped
  - [x] `replacement_spec.rb` — 1002 → 1000; year-range guard; unknown
        tag guard
  - [x] `linked_data_spec.rb` extends — representation node shape; UNLK
        bridge zones on 1128; replacedBy on 1002; altLabels on 1000
  - [x] round-trip closure — parse `untded.ttl` with RDF::Turtle::Reader:
        1504 `utd:TradeDataElement` subjects; every active element has a
        `schema:name`; every zone in range; every `utd:replacedBy` object
        resolves to an element subject
- [x] `npm run sync-data` (website) extended to copy `vocabulary.json`,
  `ledger.json`, `bridges.json`, `edifact-links.json` into `data-source/`.

## Verification

`bundle exec bin/extract` (noop-stable), `bin/validate`, `bin/export`
(byte-identical where unchanged), `bin/verify` (+ new invariants),
`UNTDED_PDF=… bin/crosscheck-edifact` unchanged verdicts, full rspec
green. Then sync-data + website build green.

## Beats

Their TDED rows are mangled strings in a table; after this, "every element
on UNLK line 4" or "the full replacement graph of the 2005 revision" is
one query against our TTL.
