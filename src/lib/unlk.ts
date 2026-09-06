// The UN layout key (UNLK, ISO 6422 / UNECE Recommendation No. 1) as a
// domain object: the geometry of the standard A4 form and the mapping
// from the directory's printed bridge notation (L = line, P = character
// position) onto it. The form is a parallel realization of the same
// data the directory carries — this module is the bridge between the
// two views.
//
// Geometry per ECE/TRADE/432E (Recommendation No. 1, 2017) and
// ISO 3535: A4 portrait; margins 20 mm left, 10 mm top; image area
// 183 × 280 mm; layout-chart grid of standard boxes 22.86 × 8.48 mm
// (8 across, 33 lines); line pitch 4.2333 mm (1/6").
//
// The printed positions run 1–82 across the line; the display maps
// them linearly onto the image-area width (2.23 mm per position) — a
// close visual approximation of the printed grid, not a typesetting
// exactness.
import { formatBridgeDetail, parseBridges } from './element'

export const UNLK = {
  pageW: 210,
  pageH: 297,
  marginX: 20,
  marginY: 10,
  imageW: 183,
  imageH: 280,
  boxW: 22.86,
  boxH: 8.48,
  boxesAcross: 8,
  lines: 33,
  linePitch: 4.2333,
  positionsPerLine: 82,
} as const

export interface UnlkZone {
  lineFrom: number
  lineTo: number
  posFrom: number
  posTo: number
  format?: string
}

export interface UnlkRect extends UnlkZone {
  // millimetres on the A4 sheet
  x: number
  y: number
  w: number
  h: number
}

const posPitch = UNLK.imageW / UNLK.positionsPerLine

export function posToMm(p: number): number {
  return UNLK.marginX + (p - 1) * posPitch
}

export function lineToMm(l: number): number {
  return UNLK.marginY + (l - 1) * UNLK.linePitch
}

export function zoneToRect(z: UnlkZone): UnlkRect {
  const w = (z.posTo - z.posFrom + 1) * posPitch
  const h = (z.lineTo - z.lineFrom + 1) * UNLK.linePitch
  return {
    ...z,
    x: posToMm(z.posFrom),
    y: lineToMm(z.lineFrom),
    w: Math.min(w, UNLK.marginX + UNLK.imageW - posToMm(z.posFrom)),
    h: Math.min(h, UNLK.marginY + UNLK.imageH - lineToMm(z.lineFrom)),
  }
}

// Zones of one element's UNLK bridge, from the printed notation:
// line and position segments pair into zones; a format token attaches
// to the zone it follows. A line without positions spans the full
// line; positions without a line are not locatable and are dropped.
export function unlkZones(bridges: string | null): UnlkZone[] {
  const entry = parseBridges(bridges).find((b) => b.scheme === 'UNLK')
  if (!entry) return []
  // The printed cells vary: "L15", lowercase "p 74-80", "P 00-08".
  // Normalize spacing, case, and zero-based positions before parsing.
  const detail = entry.detail
    .replace(/\b([LP])(\d)/g, '$1 $2')
    .replace(/\b([lp])(\s+\d)/gi, (_, c: string, rest: string) => c.toUpperCase() + rest)
  const zones: UnlkZone[] = []
  let pending: { from: number; to: number } | null = null
  let format: string | undefined
  const flush = () => {
    if (pending) zones.push(zoneOf(pending, 1, UNLK.positionsPerLine, format))
    pending = null
  }
  for (const seg of formatBridgeDetail(detail)) {
    if (seg.kind === 'lines') {
      flush()
      pending = { from: seg.from, to: seg.to ?? seg.from }
    } else if (seg.kind === 'positions' && pending) {
      zones.push(zoneOf(pending, Math.max(1, seg.from), Math.max(1, seg.to ?? seg.from), format))
      pending = null
      format = undefined
    } else if (seg.kind === 'format') {
      format = seg.text
    }
  }
  flush()
  return zones
}

function zoneOf(
  lines: { from: number; to: number },
  posFrom: number,
  posTo: number,
  format?: string,
): UnlkZone {
  return { lineFrom: lines.from, lineTo: lines.to, posFrom, posTo, format }
}

export function unlkRects(bridges: string | null): UnlkRect[] {
  return unlkZones(bridges).map(zoneToRect)
}

// The model form's fixed sections, per the UNLK: parties and transport
// upper left, commercial upper right, goods and customs across the
// middle, free disposal at the base.
export interface UnlkBand {
  key: string
  label: string
  x: number
  y: number
  w: number
  h: number
}

export const UNLK_BANDS: UnlkBand[] = [
  { key: 'parties', label: 'Parties · transport', x: UNLK.marginX, y: UNLK.marginY, w: UNLK.imageW / 2, h: 12 * UNLK.linePitch },
  { key: 'commercial', label: 'Commercial', x: UNLK.marginX + UNLK.imageW / 2, y: UNLK.marginY, w: UNLK.imageW / 2, h: 12 * UNLK.linePitch },
  { key: 'goods', label: 'Goods · customs', x: UNLK.marginX, y: UNLK.marginY + 12 * UNLK.linePitch, w: UNLK.imageW, h: 15 * UNLK.linePitch },
  { key: 'free', label: 'Free disposal', x: UNLK.marginX, y: UNLK.marginY + 27 * UNLK.linePitch, w: UNLK.imageW, h: 6 * UNLK.linePitch },
]

// A view over the sheet for the interactive form: a window in millimetre
// coordinates. The aspect is pinned to the page's, so one factor
// (clientWidth / vb.w) describes the render at every zoom.
export interface UnlkViewBox {
  x: number
  y: number
  w: number
  h: number
}

const VIEW_ASPECT = UNLK.pageH / UNLK.pageW

export const FULL_VIEW: UnlkViewBox = { x: 0, y: 0, w: UNLK.pageW, h: UNLK.pageH }

export const MAX_ZOOM = 12

function normalized(vb: UnlkViewBox): UnlkViewBox {
  const w = Math.min(Math.max(vb.w, UNLK.pageW / MAX_ZOOM), UNLK.pageW)
  const h = w * VIEW_ASPECT
  const clampAxis = (v: number, size: number, total: number) =>
    Math.min(Math.max(v, Math.min(0, total - size)), Math.max(0, total - size))
  return { x: clampAxis(vb.x, w, UNLK.pageW), y: clampAxis(vb.y, h, UNLK.pageH), w, h }
}

export function zoomView(vb: UnlkViewBox, factor: number, ax: number, ay: number): UnlkViewBox {
  const w = Math.min(Math.max(vb.w / factor, UNLK.pageW / MAX_ZOOM), UNLK.pageW)
  const r = w / vb.w
  return normalized({ x: ax - (ax - vb.x) * r, y: ay - (ay - vb.y) * r, w, h: vb.h * r })
}

export function panView(vb: UnlkViewBox, dxUser: number, dyUser: number): UnlkViewBox {
  return normalized({ x: vb.x + dxUser, y: vb.y + dyUser, w: vb.w, h: vb.h })
}

export function fitZone(z: { x: number; y: number; w: number; h: number }, pad = 6): UnlkViewBox {
  const w = Math.max(z.w + pad * 2, (z.h + pad * 2) / VIEW_ASPECT)
  const h = w * VIEW_ASPECT
  return normalized({ x: z.x + z.w / 2 - w / 2, y: z.y + z.h / 2 - h / 2, w, h })
}
