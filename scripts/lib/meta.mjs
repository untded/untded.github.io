// Pure seam: dataset aggregates. CATEGORIES is the SSOT for the nine
// TDED tag ranges; the site derives all category UI from meta.json.
export const CATEGORIES = [
  { k: 1, range: '1000-1699', label: 'Documentation, references' },
  { k: 2, range: '2000-2699', label: 'Dates, times, periods' },
  { k: 3, range: '3000-3699', label: 'Parties, addresses, places, countries' },
  { k: 4, range: '4000-4699', label: 'Clauses, conditions, terms, instructions' },
  { k: 5, range: '5000-5699', label: 'Amounts, charges, percentages' },
  { k: 6, range: '6000-6699', label: 'Measures, quantities' },
  { k: 7, range: '7000-7699', label: 'Goods and articles' },
  { k: 8, range: '8000-8699', label: 'Transport modes, means, equipment' },
  { k: 9, range: '9000-9699', label: 'Other data elements (Customs, etc.)' },
]

const CHANGE_GROUPS = {
  added: ['add'],
  changed: ['cnd', 'cndr', 'cnr', 'cn', 'cr', 'cdr', 'cd'],
  undeleted: ['u'],
  retired: ['x'],
}

export function buildMeta(elements) {
  const byCategory = Object.fromEntries(
    CATEGORIES.map((c) => {
      const inRange = elements.filter((e) => Math.floor(e.tag / 1000) === c.k)
      return [
        c.k,
        {
          ...c,
          count: inRange.length,
          active: inRange.filter((e) => e.status === 'active').length,
        },
      ]
    }),
  )
  const changeTagTally = tally(elements.map((e) => e.change_tag))
  return {
    count: elements.length,
    categories: CATEGORIES.map((c) => byCategory[c.k]),
    changeTagTally,
    groups: Object.fromEntries(
      Object.entries(CHANGE_GROUPS).map(([group, tags]) => [
        group,
        tags.reduce((n, t) => n + (changeTagTally[t] ?? 0), 0),
      ]),
    ),
    provenance: {
      pdf: 'UNTDED2005_Redacted.pdf',
      pages: '28-132',
      edition: 'UNTDED 2005 (ECE/TRADE/362, ISO 7372:2005)',
    },
  }
}

function tally(values) {
  return values.reduce((acc, v) => ((acc[v] = (acc[v] ?? 0) + 1), acc), {})
}
