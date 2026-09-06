# 21 — The UN layout key as a parallel realization

The UNLK is a separate object: the same data the directory carries,
realized as the standard A4 printed form. Modeled accordingly.

- `src/lib/unlk.ts` — the domain object: geometry from ECE/TRADE/432E
  (Recommendation No. 1) and ISO 3535 (A4 portrait, 183×280 mm image
  area, 8 standard boxes × 33 lines, 4.2333 mm line pitch, positions
  1–82 mapped linearly as a display approximation), plus zone
  extraction from the printed bridge notation — tolerating the source's
  "L15", lowercase "p 74-80", "P 00-08" and spaced-hyphen variants.
- `UnlkForm.astro` — the form drawn to scale in SVG; card variant
  highlights one element's fields, page variant reconstructs the model
  form with section bands (parties/transport, commercial,
  goods/customs, free disposal) and hover titles per field.
- `PositionRuler.astro` — the 1–82 character ruler with the lit span
  and the printed format at true width (an..17 in 18 positions).
- Element pages: "On the UN layout key" card (form + ruler + reading),
  shown when the element carries a UNLK bridge.
- `/unlk` — the reconstruction: all UNLK bridges from the dataset
  plotted as fields; shared fields list their elements (the
  master-document principle); nav entry, notation cross-link,
  citations. 253 elements, 132 distinct fields.
- Specs for the zone parser and geometry; contracts for the page,
  card, and nav link.

Verified: 77 tests green, astro check 0, lychee 0; screenshots of both
views reviewed — field distribution matches the model form (dense in
commercial and goods), the three representations of a field agree.
