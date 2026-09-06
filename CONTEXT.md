# CONTEXT — domain glossary (website)

Terms used across this repository. The domain is the **United Nations
Trade Data Elements Directory (UN/TDED), 2005 edition**; the dataset
lives in `untded/untded-2005` (see its CONTEXT.md). This site is the
public registry for that dataset.

- **Directory** — the browsable list of all 1504 elements
  (`/elements`); filtering lives in the `DirectoryFilter` island.
- **Element page** — `/elements/<tag>`: the element's printed facts,
  a Source card (ECE/TRADE/362, page N) deep-linking the hosted PDF,
  and its RDF alternates (`data.jsonld` / `data.ttl`).
- **Category** — one of the nine tag ranges. Defined by the dataset
  (`derived/categories.json`, synced to `data-source/categories.json`);
  the website never edits it — labels are the source's own section
  titles, display-capitalised at load (`loadCategories`).
- **Change tag** — printed change indicator vs. the 1993 edition;
  interpreted for display by `changeTagInfo` (`src/lib/element.ts`),
  tallied by `CHANGE_GROUPS` (`scripts/lib/meta.mjs`).
- **Representation** — the printed value notation (`an..35`); explained
  on `/notation`, summarised by `ReprChip`.
- **Name tree** — `/tree`: the name-hierarchy browser (old names →
  2005 names), built by `src/lib/tree.ts` from the dataset.
- **Source publication** — ECE/TRADE/362, hosted at
  `/pdf/UNTDED2005.pdf`; every deep link goes through
  `sourcePdfUrl()` (`src/lib/site.ts`).
- **Sync** — `npm run sync-data`: pulls the dataset's derived artifacts
  into `data-source/` (committed). The dataset is the only writer of
  elements and categories; this repo derives everything else.
- **Contracts** — dist-based page contracts
  (`src/lib/site-contracts.pages.spec.ts`): routes, budgets, whitespace
  collapse, vocabulary closure, mandate citation. The vitest
  `globalSetup` rebuilds when inputs are newer than `dist/`, so a green
  suite always means a fresh build.
- **Closure (vocabulary)** — the graph invariant that every used
  `utd:` term is declared in `untded.jsonld` itself; asserted here and
  in the dataset's specs.
