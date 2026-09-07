// UNLK explorer view model — the pure state machine behind the
// component. Owns the viewBox, pan/zoom/fit/reset, and filter
// matching. No DOM access; the component wires events to these
// methods and applies the resulting state.
import { FULL_VIEW, MAX_ZOOM, UNLK, fitZone, panView, zoomView, type UnlkViewBox } from './unlk'

export interface UnlkFieldData {
  key: string
  rect: [number, number, number, number]
  elements: Array<[number, string, string]>
}

export class UnlkViewModel {
  private _vb: UnlkViewBox = FULL_VIEW
  private _selected: string | null = null
  private _filter = ''

  constructor(private fields: UnlkFieldData[]) {}

  get viewBox(): UnlkViewBox { return this._vb }
  get selected(): string | null { return this._selected }
  get filter(): string { return this._filter }

  get zoomLevel(): number { return FULL_VIEW.w / this._vb.w }
  get canZoomIn(): boolean { return this._vb.w > UNLK.pageW / MAX_ZOOM + 1e-9 }
  get canZoomOut(): boolean { return this._vb.w < UNLK.pageW - 1e-9 }

  /** Convert viewport-relative pixel delta to viewBox delta. */
  pixelDelta(dxPx: number, dyPx: number, viewportWidth: number): { dx: number; dy: number } {
    return { dx: (dxPx / viewportWidth) * this._vb.w, dy: (dxPx / viewportWidth) * this._vb.h }
  }

  /** Convert viewport-relative pixel point to viewBox point. */
  pixelPoint(px: number, py: number, rect: { left: number; top: number; width: number; height: number }): { x: number; y: number } {
    return {
      x: this._vb.x + ((px - rect.left) / rect.width) * this._vb.w,
      y: this._vb.y + ((py - rect.top) / rect.height) * this._vb.h,
    }
  }

  pan(dxPx: number, dyPx: number, viewportWidth: number): void {
    const { dx, dy } = this.pixelDelta(dxPx, dyPx, viewportWidth)
    this._vb = panView(this._vb, dx, dy)
  }

  zoomAt(factor: number, point: { x: number; y: number }): void {
    this._vb = zoomView(this._vb, factor, point.x, point.y)
  }

  zoomCenter(factor: number): void {
    this.zoomAt(factor, { x: this._vb.x + this._vb.w / 2, y: this._vb.y + this._vb.h / 2 })
  }

  fit(rect: { x: number; y: number; w: number; h: number }, margin: number): void {
    this._vb = fitZone(rect, margin)
  }

  reset(): void {
    this._vb = FULL_VIEW
    this._selected = null
  }

  select(key: string): void {
    const f = this.fields.find((x) => x.key === key)
    if (!f) return
    this._selected = key
    this.fit({ x: f.rect[0], y: f.rect[1], w: f.rect[2], h: f.rect[3] }, 8)
  }

  /** Filter: which fields match the current query. */
  setFilter(query: string): void {
    this._filter = query.trim().toLowerCase()
  }

  fieldMatches(key: string): boolean {
    if (!this._filter) return true
    const f = this.fields.find((x) => x.key === key)
    if (!f) return false
    return f.elements.some(([tag, name]) =>
      String(tag).startsWith(this._filter) || name.toLowerCase().includes(this._filter))
  }

  get isFiltered(): boolean { return this._filter.length > 0 }
}
