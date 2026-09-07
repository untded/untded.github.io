// Pure seam behind the ⌘K omnibox: instant lookup of an element by tag
// or name prefix/substring. Returns ranked rows, best first.
import type { IndexRow } from './data'

// Typed queries say "type cod", not "type.cod" — normalize separators
// on both sides before matching.
function normalize(s: string): string {
  return s.toLowerCase().replace(/[.\s]+/g, ' ').trim()
}

export function omniboxFilter(rows: IndexRow[], query: string, limit = 12): IndexRow[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const nq = normalize(q)
  const scored: { row: IndexRow; score: number }[] = []
  for (const row of rows) {
    const name = normalize(row.n)
    let score = 0
    if (/^\d{1,4}$/.test(q)) {
      const t = String(row.t)
      if (t === q) score = 100
      else if (t.startsWith(q)) score = 70
      else if (t.includes(q)) score = 40
    }
    if (score === 0 && name) {
      if (name === nq) score = 90
      else if (name.startsWith(nq)) score = 60
      else if (name.includes(nq)) score = 30
    }
    if (score > 0) scored.push({ row, score })
  }
  scored.sort((a, b) => b.score - a.score || a.row.t - b.row.t)
  return scored.slice(0, limit).map((s) => s.row)
}

// The registry's own pages, searchable the same way: ⌘K reaches the
// whole surface, not only elements. Matched by title/keyword prefix or
// substring; scores sit below an exact element hit and above substring
// name hits, so digits always find the element and words find pages.
export interface PageResult {
  route: string
  title: string
  keywords: string[]
}

export const REGISTRY_PAGES: PageResult[] = [
  { route: '/ontology', title: 'The ontology', keywords: ['vocabulary', 'model', 'classes', 'properties', 'rdf', 'turtle'] },
  { route: '/ledger', title: 'The 1993–2005 ledger', keywords: ['change', 'history', 'edition', 'retired', 'replaced', 'deletion'] },
  { route: '/bridges', title: 'Bridges by document system', keywords: ['unlk', 'sad', 'mar', 'cimp', 'cim', 'awb', 'cmr', 'swift', 'carrier', 'coverage'] },
  { route: '/unlk', title: 'The UN layout key', keywords: ['form', 'layout', 'master', 'iso 6422', 'positions'] },
  { route: '/document', title: 'The publication itself', keywords: ['foreword', 'introduction', 'maintenance', 'presentation', 'text'] },
  { route: '/docs', title: 'The documentation', keywords: ['guides', 'alignment', 'register', 'contributing'] },
  { route: '/docs/alignment-edifact', title: 'UN/EDIFACT alignment', keywords: ['eded', 'edifact', 'uncl', 'd05b', 'codes'] },
  { route: '/docs/provenance', title: 'Provenance', keywords: ['extraction', 'ocr', 'confidence', 'review queue'] },
  { route: '/docs/context', title: 'The JSON-LD context', keywords: ['json-ld', 'context', 'interop'] },
  { route: '/notation', title: 'Notation', keywords: ['representation', 'abbreviations', 'glossary', 'an35'] },
  { route: '/tree', title: 'The name tree', keywords: ['names', 'hierarchy', 'classes of names'] },
  { route: '/download', title: 'Download the dataset', keywords: ['csv', 'yaml', 'json', 'dataset', 'machine'] },
]

export function pageFilter(pages: PageResult[], query: string, limit = 4): PageResult[] {
  const nq = normalize(query)
  if (!nq || /^\d+$/.test(query.trim())) return []
  const scored: { page: PageResult; score: number }[] = []
  for (const page of pages) {
    const routeToken = page.route.split('/').filter(Boolean).pop() ?? ''
    const hay = [page.title, routeToken, ...page.keywords].map(normalize)
    let score = 0
    if (hay.some((h) => h === nq)) score = 85
    else if (hay.some((h) => h.startsWith(nq))) score = 60
    else if (hay.some((h) => h.includes(nq))) score = 35
    if (score > 0) scored.push({ page, score })
  }
  scored.sort((a, b) => b.score - a.score || a.page.route.localeCompare(b.page.route))
  return scored.slice(0, limit).map((s) => s.page)
}
