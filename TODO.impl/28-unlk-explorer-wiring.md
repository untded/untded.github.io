# 28 — UNLK explorer: wire the view model into the component

The UnlkViewModel exists (track 23, src/lib/unlk-view.ts) with 7 unit
tests. The component's 200-line inline script still manages state
directly (let vb, inline pan/zoom, inline filter). This track replaces
the inline state management with view model calls.

## Tasks

- [x] Replace `let vb: UnlkViewBox = FULL_VIEW` with
      `const vm = new UnlkViewModel(fields)`
- [x] The `apply()` function reads from `vm.viewBox`
- [x] Event handlers call `vm.pan()`, `vm.zoomAt()`, `vm.reset()`,
      `vm.select()`, `vm.setFilter()` instead of inline state mutation
- [x] Remove now-unused direct imports (fitZone, panView, zoomView)
- [x] Verify: the explorer still works (build + browser test)

## Why

OCP: new interactions extend the view model (which is tested), not the
component's inline script (which is not). MECE: the state machine
lives in one place. Testability: the interaction logic is already
unit-tested; this connects it.
