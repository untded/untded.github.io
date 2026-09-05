// Pure filter seam behind the directory island. Filters IndexRows by
// the URL-shareable parameter set; the island is a thin shell over this.
import type { IndexRow } from './data'

export interface DirectoryFilters {
  q: string
  cat: number | 0 // 0 = all
  status: 'all' | 'active' | 'retired'
  change: string // '' = all
  cs: string // '' = all (an | n | a)
  sort: 'tag' | '-tag' | 'name' | '-name'
}

export const EMPTY_FILTERS: DirectoryFilters = {
  q: '',
  cat: 0,
  status: 'all',
  change: '',
  cs: '',
  sort: 'tag',
}

const SORTS = new Set(['tag', '-tag', 'name', '-name'])

export function filterRows(rows: IndexRow[], f: DirectoryFilters): IndexRow[] {
  const q = f.q.trim().toLowerCase()
  const out = rows.filter((r) => {
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
  const dir = f.sort.startsWith('-') ? -1 : 1
  const key = f.sort.replace('-', '') as 'tag' | 'name'
  return out.sort((a, b) => {
    if (key === 'tag') return (a.t - b.t) * dir
    // retired rows without a 2005 name sort last in name order, by tag
    if (!a.n) return 1
    if (!b.n) return -1
    return a.n.localeCompare(b.n) * dir || a.t - b.t
  })
}

export function filtersFromParams(params: URLSearchParams): DirectoryFilters {
  const cat = Number(params.get('cat') ?? 0)
  const status = params.get('status')
  const sort = params.get('sort') ?? 'tag'
  return {
    q: params.get('q') ?? '',
    cat: cat >= 1 && cat <= 9 ? cat : 0,
    status: status === 'active' || status === 'retired' ? status : 'all',
    change: params.get('change') ?? '',
    cs: params.get('cs') ?? '',
    sort: SORTS.has(sort) ? (sort as DirectoryFilters['sort']) : 'tag',
  }
}
