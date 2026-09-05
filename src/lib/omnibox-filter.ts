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
