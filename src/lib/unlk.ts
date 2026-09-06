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
