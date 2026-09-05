// Domain SSOT: how an element record becomes display language.
// Every label, category resolution and bridge parse in the site derives
// from here — components never re-encode this knowledge.
import type { ElementRecord } from './data'

// Legend as printed in UNTDED 2005 section 4.1 (the source's own words,
// abridged); tags outside the printed legend (cd/cr/cdr) are annotated.
const CHANGE_TAG_LABELS: Record<string, string> = {
  add: 'Added',
  u: 'Undeleted (re-instated)',
  cn: 'Changed name',
  cnd: 'Changed name + description',
  cnr: 'Changed name + representation',
  cndr: 'Changed name + description + representation',
  x: 'Marked for deletion',
}

const OUTSIDE_LEGEND = new Set(['cd', 'cr', 'cdr'])

export interface ChangeTagInfo {
  label: string
  short: string
  outsideLegend: boolean
}

export function changeTagInfo(changeTag: string): ChangeTagInfo {
  return {
    label: CHANGE_TAG_LABELS[changeTag] ?? changeTag,
    short: changeTag,
    outsideLegend: OUTSIDE_LEGEND.has(changeTag),
  }
}

export const CATEGORY_RANGES = [
  { k: 1, range: '1000-1699', label: 'Documentation, references' },
  { k: 2, range: '2000-2699', label: 'Dates, times, periods' },
  { k: 3, range: '3000-3699', label: 'Parties, addresses, places, countries' },
  { k: 4, range: '4000-4699', label: 'Clauses, conditions, terms, instructions' },
  { k: 5, range: '5000-5699', label: 'Amounts, charges, percentages' },
  { k: 6, range: '6000-6699', label: 'Measures, quantities' },
  { k: 7, range: '7000-7699', label: 'Goods and articles' },
  { k: 8, range: '8000-8699', label: 'Transport modes, means, equipment' },
  { k: 9, range: '9000-9699', label: 'Other data elements (Customs, etc.)' },
] as const

export type Category = (typeof CATEGORY_RANGES)[number]

export function categoryOf(tag: number): Category {
  return CATEGORY_RANGES[Math.floor(tag / 1000) - 1]
}

export function elementUrl(tag: number): string {
  return `/elements/${tag}`
}

export interface Bridge {
  scheme: string
  detail: string
}

const BRIDGE_SCHEME = /(?:CIMP|UNLK|CIM|MAR|SAD|EDIFACT|ISO):/g

// "UNLK: L 04, P 41-45 CIMP: (120): a1" -> per-scheme entries. The
// trailing colon is part of the match so a scheme word occurring inside
// a detail (e.g. "SAD: (SAD 1)") is not mistaken for a new entry.
export function parseBridges(bridges: string | null): Bridge[] {
  if (!bridges) return []
  const out: Bridge[] = []
  let match: RegExpExecArray | null
  let last = 0
  let lastScheme = ''
  BRIDGE_SCHEME.lastIndex = 0
  while ((match = BRIDGE_SCHEME.exec(bridges)) !== null) {
    if (lastScheme) {
      out.push({ scheme: lastScheme, detail: bridges.slice(last, match.index).trim() })
    }
    last = match.index + match[0].length
    lastScheme = match[0].slice(0, -1)
  }
  if (lastScheme) {
    out.push({ scheme: lastScheme, detail: bridges.slice(last).trim() })
  }
  return out
}

export function replacementPointer(element: ElementRecord): number | null {
  if (element.status !== 'retired' || !element.notes) return null
  const refs = [...element.notes.matchAll(/\b\d{4}\b/g)].map((m) => Number(m[0]))
    .filter((n) => n !== element.tag && n > 699 && !(n >= 1970 && n <= 2099))
  return refs[0] ?? null
}

export function reprSummary(repr: ElementRecord['representation']): string {
  if (!repr) return '—'
  return `${repr.charset}${repr.min_length === repr.max_length ? repr.max_length : `..${repr.max_length}`}`
}
