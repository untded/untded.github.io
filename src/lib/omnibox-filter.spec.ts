import { describe, expect, it } from 'vitest'
import { omniboxFilter, pageFilter, REGISTRY_PAGES } from './omnibox-filter'
import { loadElements } from './data'
import type { IndexRow } from './data'
import { toIndexRows } from '../../scripts/lib/build-index.mjs'

const rows: IndexRow[] = [
  { t: 1000, n: 'Document. Type Name.Text', r: 'an..35', c: 'cnd', s: 'a', k: 1 },
  { t: 1001, n: 'Document. Type.Code', r: 'an..3', c: 'cndr', s: 'a', k: 1 },
  { t: 1004, n: 'Document. Identifier', r: 'an..35', c: 'cnd', s: 'a', k: 1 },
  { t: 5004, n: 'Monetary Amount. Amount', r: 'n..18', c: 'cnd', s: 'a', k: 5 },
]

describe('omniboxFilter', () => {
  it('ranks exact tag first, then tag prefixes', () => {
    expect(omniboxFilter(rows, '100').map((r) => r.t)).toEqual([1000, 1001, 1004])
    expect(omniboxFilter(rows, '1001').map((r) => r.t)).toEqual([1001])
  })

  it('matches names and ranks prefixes above substrings', () => {
    expect(omniboxFilter(rows, 'document. type').map((r) => r.t)).toEqual([1000, 1001])
    expect(omniboxFilter(rows, 'amount').map((r) => r.t)).toEqual([5004])
  })

  it('returns nothing for empty queries and respects the limit', () => {
    expect(omniboxFilter(rows, '  ')).toEqual([])
    expect(omniboxFilter(rows, '1', 2)).toHaveLength(2)
  })
})

describe('against the real index', () => {
  it('finds Document. Type.Code from partial input', () => {
    const index = toIndexRows(loadElements())
    expect(omniboxFilter(index, '1001')[0].t).toBe(1001)
    expect(omniboxFilter(index, 'type cod')[0]?.t).toBe(1001)
  })
})

describe('pageFilter', () => {
  it('finds registry pages by title and keyword', () => {
    expect(pageFilter(REGISTRY_PAGES, 'ontology').map((p) => p.route)).toContain('/ontology')
    expect(pageFilter(REGISTRY_PAGES, 'unlk').map((p) => p.route)).toContain('/unlk')
    expect(pageFilter(REGISTRY_PAGES, 'prov').map((p) => p.route)).toContain('/docs/provenance')
    expect(pageFilter(REGISTRY_PAGES, 'eded').map((p) => p.route)).toContain('/docs/alignment-edifact')
  })

  it('never matches digits — tag queries stay element-only', () => {
    expect(pageFilter(REGISTRY_PAGES, '1001')).toEqual([])
    expect(pageFilter(REGISTRY_PAGES, '42')).toEqual([])
  })

  it('ranks exact title above substring keyword, capped', () => {
    const out = pageFilter(REGISTRY_PAGES, 'the', 3)
    expect(out.length).toBeLessThanOrEqual(3)
  })

  it('returns nothing for empty queries', () => {
    expect(pageFilter(REGISTRY_PAGES, '')).toEqual([])
    expect(pageFilter(REGISTRY_PAGES, '   ')).toEqual([])
  })
})
