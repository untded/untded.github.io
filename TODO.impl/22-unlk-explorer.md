# 22 — The interactive UNLK explorer

The first reconstruction (TODO 21) rendered the form as a static SVG
capped at 26rem — type drawn at true millimetre scale came out ~6px and
the field contents lived only in native hover titles. An illustration,
not a readable view. Replaced by an explorer on /unlk:

- `UnlkExplorer.astro` — the form at full column width, pan and zoom
  (wheel, drag, pinch via pointer events, keyboard via zoom buttons),
  field tags rendered inside fields once ~6 px/mm is reached, a hover
  tooltip, and a click-to-select detail panel (location, format, the
  elements sharing the field, links to each). A "Sections of the model
  form" panel fits each band and counts its fields/elements. The
  complete form renders without JavaScript; only the interaction needs
  it. Re-inits on `astro:after-swap` for view transitions.
- `src/lib/unlk.ts` — view math as pure, tested functions:
  `zoomView` (anchored), `panView`, `fitZone`, page-aspect-pinned
  `UnlkViewBox`, clamped to [full page, 12×]; `UNLK_BANDS` shared by
  explorer and page.
- Pointer capture redirects pointerup to the svg, so the field under
  the pointer is captured at pointerdown and selected on release if no
  drag happened.
- Deep links: `/unlk#field=L:L:P:P` selects and fits the field;
  element pages link their first zone this way; `hashchange` selects
  on same-document moves.
- `UnlkForm` trimmed to the card locator for element pages.

Verified in a browser: click select (31-element panel), zoom clamps
1.0×–12.0×, wheel/drag, band fit, reset, deep link, dark mode.
Playwright-measured readout 3.7× after select (a vision-model claim of
a stale 1.0× readout was a misread of the small text). 81 tests green,
astro check 0 errors.
