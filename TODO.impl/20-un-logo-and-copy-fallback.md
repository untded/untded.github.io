# 20 — Official UN logo (branding assets) and dialog-free copy fallback

- The copy buttons' failure path opened a native `window.prompt` modal
  whenever the async Clipboard API was denied (older Firefox/Safari) —
  reported as "very strange". Replaced with a hidden-textarea
  execCommand fallback and inline button feedback; no dialogs anywhere.
  Verified in headless Chrome: normal copy, forced-denial path (prompt
  instrumented to record), feedback text.
- Branding assets from ~/src/untded/branding (official UN emblem,
  light #009EDC / dark #4BCCFF, 550×550 SVG + 2292px PNG):
  - favicon.svg = official light emblem; favicon-dark.svg served via
    `media="(prefers-color-scheme: dark)"`; PNG fallbacks and
    apple-touch-icon regenerated from the official art.
  - Header carries the emblem (light/dark variants swap with the site
    theme) before the UN/TDED wordmark.
  - About: the "site does not use the UN emblem" sentence replaced
    with the artwork fact.
- Contracts: favicon set incl. dark variant, header emblem, and
  "never opens a dialog from copy buttons" (no window.prompt;
  execCommand present).
