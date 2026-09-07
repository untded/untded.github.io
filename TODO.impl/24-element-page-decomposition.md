# 24 — Element page decomposition

[tag].astro is 343 lines mixing 8+ concerns: breadcrumb, pager,
compare link, aside (tag plate + representation + provenance + linked
data + YAML link), article (name, description, notes, replacements,
old names, bridges, chips, UNLK section, machine formats).

## Tasks

- [ ] Extract `ElementAside.astro` — the sidebar column (tag plate,
      status, category, representation, provenance, linked data, YAML).
- [ ] Extract `ElementArticle.astro` — the main column (name,
      description, notes, replacement, bridges, chips, UNLK card).
- [ ] [tag].astro becomes a thin shell: layout, meta, JSON-LD,
      static paths, composition.

Not started this session — the [tag].astro decomposition (343 →
~80 lines of composition) is the next structural improvement. The
pattern is clear: extract ElementAside.astro and ElementArticle.astro,
each receiving the element + derived data as props.

## Why

Locality: the aside changes for different reasons than the article.
Reuse: compare page can reuse the aside for its side-by-side cards.
Readability: 343 → ~80 lines of composition.
