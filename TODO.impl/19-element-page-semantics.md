# 19 — Element page semantics (deep audit from /elements/1128)

User-reported on /elements/1128; audited as classes.

1. **Old name prominence** — the 1993 name was only in the low "1993
   edition" block. Now also a subtitle directly under the current name
   ("1993 name: …"), so a renamed element shows its old name at the top.
   (Data was never missing: audit found 0 rename-tagged elements
   without an old name.)
2. **Bridges as structured semantics** — "UNLK an..17 L 04, P 63- 80"
   rendered as raw text, with a line-wrap artifact from extraction.
   - Dataset: two join rules fix the 65 wrapped ranges ("63- 80" →
     "63-80"); prose hyphens untouched; two elements print spaced
     ranges in the source and stay verbatim.
   - Website: formatBridgeDetail parses each detail into
     format/line/position segments → "UNLK · an..17 chip · line 04 ·
     positions 63–80". Scheme chips carry their expansion as title.
     Scheme set extended to all 12 in the data (AWB, CMR, SWIFT, ICC,
     INV, ODETTE, Inland Waterways B/L were unparsed before).
   - Glossary replaced with the publication's own abbreviations
     (introduction §1.4) — the previous hand-written expansions were
     partly wrong (MAR, SAD, CIM); L/P defined per §4.1 (ISO 3535/UNLK).
3. **Copy buttons** — the page-local script was fragile under view
   transitions; replaced with one registration-once delegated handler
   in BaseLayout (document-level click delegation survives swaps).
   Verified in headless Chrome: clipboard gets tag/IRI, feedback shows,
   works after client-side navigation.
4. **Change indicator meaning** — element pages render the meaning
   visibly next to the code ("cndr — Changed name + description +
   representation"), not only as a hover title.

Verified: 67 website tests, dataset 32 specs + verify, astro check 0,
lychee 0, and a 12-check headless-Chrome UI suite (copy, theme
persistence across navigation, bridges, meaning, 1993 name) — all pass.
