import { describe, expect, it } from 'vitest'
import { EMPTY_FILTERS, filterRows, filtersFromParams } from './directory-filter'
import type { IndexRow } from './data'

const rows: IndexRow[] = [
  { t: 1000, n: 'Document. Type Name.Text', r: 'an..35', c: 'cnd', s: 'a', k: 1 },
  { t: 1002, n: '', r: '', c: 'x', s: 'r', k: 1 },
  { t: 2000, n: 'Date. Date.Text', r: 'an..35', c: 'u', s: 'a', k: 2 },
  { t: 5004, n: 'Monetary Amount. Amount', r: 'n..18', c: 'cnd', s: 'a', k: 5 },
]

describe('filterRows', () => {
  it('passes everything through unfiltered', () => {
    expect(filterRows(rows, EMPTY_FILTERS)).toHaveLength(4)
  })

  it('filters by tag digits and name substring', () => {
    expect(filterRows(rows, { ...EMPTY_FILTERS, q: '50' })).toEqual([rows[3]])
    expect(filterRows(rows, { ...EMPTY_FILTERS, q: 'monetary' })).toEqual([rows[3]])
    expect(filterRows(rows, { ...EMPTY_FILTERS, q: 'date' })).toEqual([rows[2]])
  })

  it('filters by category, status, change tag and charset', () => {
    expect(filterRows(rows, { ...EMPTY_FILTERS, cat: 2 })).toEqual([rows[2]])
    expect(filterRows(rows, { ...EMPTY_FILTERS, status: 'retired' })).toEqual([rows[1]])
    expect(filterRows(rows, { ...EMPTY_FILTERS, change: 'u' })).toEqual([rows[2]])
    expect(filterRows(rows, { ...EMPTY_FILTERS, cs: 'n' })).toEqual([rows[3]])
  })

  it('combines filters conjunctively', () => {
    expect(filterRows(rows, { ...EMPTY_FILTERS, cat: 1, status: 'active' })).toEqual([rows[0]])
  })

  it('sorts by tag or name in both directions', () => {
    // name order: Date… < Document… < Monetary…, unnamed (retired) rows last
    expect(filterRows(rows, { ...EMPTY_FILTERS, sort: 'name' }).map((r) => r.t)).toEqual([
      2000, 1000, 5004, 1002,
    ])
    expect(filterRows(rows, { ...EMPTY_FILTERS, sort: '-tag' }).map((r) => r.t)).toEqual([
      5004, 2000, 1002, 1000,
    ])
  })
})

describe('filtersFromParams', () => {
  it('parses and guards the shareable URL form', () => {
    const f = filtersFromParams(new URLSearchParams('q=date&cat=2&status=active&change=u&cs=an'))
    expect(f).toEqual({ q: 'date', cat: 2, status: 'active', change: 'u', cs: 'an', sort: 'tag' })
    expect(filtersFromParams(new URLSearchParams('cat=99&status=bogus')).cat).toBe(0)
    expect(filtersFromParams(new URLSearchParams('cat=99&status=bogus')).status).toBe('all')
    expect(filtersFromParams(new URLSearchParams('sort=-name')).sort).toBe('-name')
    expect(filtersFromParams(new URLSearchParams('sort=bogus')).sort).toBe('tag')
  })
})
