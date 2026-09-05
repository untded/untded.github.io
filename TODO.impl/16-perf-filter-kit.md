# 16 — Performance audit + filter/chip control kit

Audit findings (measured): /elements shipped 490 KB of HTML (noscript table
with all 1504 rows, parsed by the browser even with JS on); the omnibox
hydrated client:load on every page pulling the Vue runtime eagerly; no
prefetch; no view transitions.

- [x] noscript table trimmed to a 40-row sample + category/tree signposts
      (490 KB → 33 KB, −93%); contract enforces a hard 60 KB budget
- [x] Omnibox client:load → client:idle (Vue runtime no longer blocks any page)
- [x] prefetch: prefetchAll + hover strategy — element pages feel instant
- [x] ClientRouter view transitions; all vanilla scripts marked
      data-astro-rerun (theme toggle, try-chips, copy buttons, 404, search)
- [x] inlineStylesheets auto — page CSS inlines, the site sheet caches across
      the 1500+ pages
- [x] Control kit (filter.css rework): 36px controls in a bordered filter
      card, custom select chevrons (light + dark), UN-blue focus rings with
      soft shadow, hover border transitions, row hover wash
- [x] Pills everywhere: ChangeTagBadge + ReprChip rounded-full with padded
      insets; filter-count as tinted pill; Show-all/copy/try-chip/theme-toggle/
      omnibox trigger share the filter-btn pill recipe
