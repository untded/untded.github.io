import { describe, expect, it } from 'vitest'
import {
  FULL_VIEW,
  MAX_ZOOM,
  UNLK,
  UNLK_BANDS,
  fitZone,
  panView,
  posToMm,
  unlkRects,
  unlkZones,
  zoomView,
} from './unlk'

describe('unlkZones', () => {
  it('pairs line and position into a zone, attaching the format', () => {
    expect(unlkZones('UNLK: an..17 L 04, P 63-80')).toEqual([
      { lineFrom: 4, lineTo: 4, posFrom: 63, posTo: 80, format: 'an..17' },
    ])
  })

  it('handles line ranges and spaced hyphens as printed', () => {
    expect(unlkZones('UNLK: L 16, P 45 - 61')).toEqual([
      { lineFrom: 16, lineTo: 16, posFrom: 45, posTo: 61, format: undefined },
    ])
    expect(unlkZones('UNLK: L 36-46, P 00-08')).toEqual([
      { lineFrom: 36, lineTo: 36 + 10, posFrom: 1, posTo: 8, format: undefined },
    ])
  })

  it('normalizes glued and lowercase notation', () => {
    expect(unlkZones('UNLK: L15, P 27-44')).toEqual([
      { lineFrom: 15, lineTo: 15, posFrom: 27, posTo: 44, format: undefined },
    ])
    expect(unlkZones('UNLK: Date only: L 21, p 74-80')).toEqual([
      { lineFrom: 21, lineTo: 21, posFrom: 74, posTo: 80, format: undefined },
    ])
  })

  it('drops non-UNLK schemes and unlocatable positions', () => {
    expect(unlkZones('AWB: L 26, P 45-55 CIMP: (508) n..11')).toEqual([])
    expect(unlkZones('UNLK: n..11')).toEqual([])
  })
})

describe('geometry', () => {
  it('maps positions onto the image area', () => {
    expect(posToMm(1)).toBeCloseTo(UNLK.marginX, 5)
    expect(posToMm(UNLK.positionsPerLine + 1)).toBeCloseTo(UNLK.marginX + UNLK.imageW, 2)
  })

  it('clamps field rectangles to the image area', () => {
    const [r] = unlkRects('UNLK: L 36-46, P 00-08')
    expect(r.x).toBeCloseTo(UNLK.marginX, 5)
    expect(r.y + r.h).toBeLessThanOrEqual(UNLK.marginY + UNLK.imageH + 1e-6)
  })
})

describe('view box', () => {
  it('zooms toward the anchor and keeps the page aspect', () => {
    const z = zoomView(FULL_VIEW, 2, 105, 148.5)
    expect(z.w).toBeCloseTo(UNLK.pageW / 2, 5)
    expect(z.h / z.w).toBeCloseTo(UNLK.pageH / UNLK.pageW, 5)
    expect(z.x + z.w / 2).toBeCloseTo(105, 3)
  })

  it('clamps zoom between the full page and the maximum', () => {
    expect(zoomView(FULL_VIEW, 0.1, 100, 100).w).toBe(UNLK.pageW)
    expect(zoomView(FULL_VIEW, 1000, 100, 100).w).toBeCloseTo(UNLK.pageW / MAX_ZOOM, 5)
  })

  it('keeps a full-page view fixed under panning', () => {
    expect(panView(FULL_VIEW, -40, 60)).toEqual(FULL_VIEW)
  })

  it('fits a band around its zone', () => {
    const band = UNLK_BANDS[0]
    const v = fitZone(band, 4)
    expect(v.w).toBeLessThanOrEqual(UNLK.pageW)
    expect(v.x).toBeLessThanOrEqual(band.x + 1e-6)
    expect(v.x + v.w).toBeGreaterThanOrEqual(band.x + band.w - 1e-6)
  })
})
