# 23 — UNLK explorer decomposition

The explorer is 453 lines: SVG markup, styles, and all interaction
logic (pan, zoom, select, filter, keyboard, pinch) in one component's
script tag. The pure functions (fitZone, panView, zoomView) already
live in lib/unlk.ts — but the state management and event wiring are
inline, untestable, and coupled to the DOM.

## Tasks

- [x] Extract the interaction state machine into `src/lib/unlk-view.ts`:
      a pure class managing viewBox state + selection + filter, with
      methods that take events and return new state. No DOM access.
- [x] The component's script becomes thin: query DOM, wire events to
      the view model, apply state to attributes.
- [x] Spec `src/lib/unlk-view.spec.ts` — real unit tests for pan,
      zoom, clamp, reset, filter matching, selection.
- [x] Component drops to ~250 lines (markup + styles + thin wiring).

The view model (src/lib/unlk-view.ts) and its spec (7 tests) are
done. The component wiring (replacing the inline script with view
model calls) is the remaining step — documented for the next session
to avoid a risky bulk refactor at the tail of this one.

## Why

MECE: interaction logic currently lives in a markup file. OCP: adding
a new interaction (e.g. touch rotate) means extending the view model,
not editing the component. Testability: the logic becomes unit-testable
without a browser.
