# 15 — Persistent theme, responsive/mobile audit, footer logos, polish

- [x] Light/dark toggle (header), persisted in localStorage, system fallback,
      no-flash inline script; .dark class drives the existing token flip
- [x] Footer carries UNECE + ISO logos on constant plates (about-page pattern)
- [x] Responsive audit: directory table horizontal scroll, filter input width
      on small screens, tree mobile-first wrapping
- [x] sr-only captions on data tables; '/' opens the omnibox
- [x] og:image + twitter card; robots.txt endpoint with sitemap
- [x] Arch: remove dead exports, extract rdf-copy seam + spec
- [x] Docs: README/CLAUDE reflect tree + theme

Additional from user during implementation:
- [x] Deep audit of the document pages: complete original text (1.2 references,
      1.3 definitions, 1.4 abbreviations, 1.5 character sets; 2.3/2.4 procedures;
      4.1.2-4.1.7 full notation/grouping/cross-ref/tag rules) — no meta-notes,
      no deflection to other pages
- [x] Host the source PDFs on the site (/pdf/UNTDED2005.pdf + Redacted);
      every element's Source card deep-links to its PDF page
- [x] Private redacted working copy removed from the site (card, file, sync,
      contracts); element deep-links point at the public full PDF (identical
      pagination for the table pages)
