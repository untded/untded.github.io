import { describe, expect, it } from 'vitest'
import { omniboxFilter } from './omnibox-filter'
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
