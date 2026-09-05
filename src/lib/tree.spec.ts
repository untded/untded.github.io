import { describe, expect, it } from 'vitest'
import { buildTree, filterTree } from './tree'
import { loadElements } from './data'
import type { IndexRow } from './data'
import { toIndexRows } from '../../scripts/lib/build-index.mjs'

const rows: IndexRow[] = [
  { t: 1000, n: 'Document. Type Name.Text', r: 'an..35', c: 'cnd', s: 'a', k: 1 },
  { t: 1001, n: 'Document. Type.Code', r: 'an..3', c: 'cndr', s: 'a', k: 1 },
  { t: 1012, n: 'Packing List Document. Item Sequence.Identifier', r: 'n..5', c: 'add', s: 'a', k: 1 },
  { t: 1002, n: '', r: '', c: 'x', s: 'r', k: 1 },
  { t: 2000, n: 'Date. Date.Text', r: 'an..35', c: 'u', s: 'a', k: 2 },
]

describe('buildTree', () => {
  const tree = buildTree(rows)

  it('groups by category, then object class, then element', () => {
    expect(tree.map((c) => c.k)).toEqual([1, 2])
    const cat1 = tree[0]
    expect(cat1.classes.map((c) => c.label).sort()).toEqual(['Document', 'Packing List Document'])
    const doc = cat1.classes.find((c) => c.label === 'Document')!
    expect(doc.leaves.map((l) => l.tag)).toEqual([1000, 1001])
    expect(doc.count).toBe(2)
    expect(cat1.unnamed.map((l) => l.tag)).toEqual([1002])
    expect(cat1.count).toBe(4)
  })

  it('splits names on dots and trims segments', () => {
    const doc = buildTree(rows)[0].classes.find((c) => c.label === 'Document')!
    expect(doc.leaves.find((l) => l.tag === 1001)!.name).toBe('Document. Type.Code')
  })
})

describe('filterTree', () => {
  const tree = buildTree(rows)

  it('keeps only matching branches and counts matches', () => {
    const { tree: filtered, matches } = filterTree(tree, 'type')
    expect(matches).toBe(2)
    expect(filtered).toHaveLength(1)
    expect(filtered[0].classes).toHaveLength(1)
    expect(filtered[0].classes[0].leaves.map((l) => l.tag)).toEqual([1000, 1001])
  })

  it('matches tags by prefix', () => {
    const { matches, tree: filtered } = filterTree(tree, '100')
    expect(matches).toBe(3) // 1000, 1001 named; 1002 unnamed
    expect(filtered[0].unnamed.map((l) => l.tag)).toEqual([1002])
  })

  it('returns the full tree on an empty query', () => {
    expect(filterTree(tree, '  ').tree).toBe(tree)
  })
})

describe('against the real index', () => {
  it('places every element exactly once', () => {
    const index = toIndexRows(loadElements())
    const tree = buildTree(index)
    const placed =
      tree.reduce((n, c) => n + c.classes.reduce((m, cls) => m + cls.count, 0) + c.unnamed.length, 0)
    expect(placed).toBe(index.length)
    expect(tree).toHaveLength(9)
  })
})
