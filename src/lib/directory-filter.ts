// Pure filter seam behind the directory island. Filters IndexRows by
// the URL-shareable parameter set; the island is a thin shell over this.
import type { IndexRow } from './data'

export interface DirectoryFilters {
  q: string
  cat: number | 0 // 0 = all
  status: 'all' | 'active' | 'retired'
  change: string // '' = all
  cs: string // '' = all (an | n | a)
}

export const EMPTY_FILTERS: DirectoryFilters = {
  q: '',
  cat: 0,
  status: 'all',
  change: '',
  cs: '',
}

export function filterRows(rows: IndexRow[], f: DirectoryFilters): IndexRow[] {
  const q = f.q.trim().toLowerCase()
  return rows.filter((r) => {
    if (f.cat !== 0 && r.k !== f.cat) return false
    if (f.status === 'active' && r.s !== 'a') return false
    if (f.status === 'retired' && r.s !== 'r') return false
    if (f.change && r.c !== f.change) return false
    if (f.cs && !r.r.startsWith(f.cs)) return false
    if (q) {
      const tagMatch = /^\d{1,4}$/.test(q) && String(r.t).startsWith(q)
      if (!tagMatch && !r.n.toLowerCase().includes(q)) return false
    }
    return true
  })
}

export function filtersFromParams(params: URLSearchParams): DirectoryFilters {
  const cat = Number(params.get('cat') ?? 0)
  const status = params.get('status')
  return {
    q: params.get('q') ?? '',
    cat: cat >= 1 && cat <= 9 ? cat : 0,
    status: status === 'active' || status === 'retired' ? status : 'all',
    change: params.get('change') ?? '',
    cs: params.get('cs') ?? '',
  }
}
