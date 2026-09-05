// Pure seam: builds the name hierarchy from the compact index rows.
// The 2005 names are dotted structures (Object class. Property term.
// Representation term); the tree is category → object class → element,
// with unnamed (retired) elements grouped per category.
import type { IndexRow } from './data'

export interface TreeLeaf {
  kind: 'leaf'
  tag: number
  name: string
  repr: string
  status: 'a' | 'r'
}

export interface TreeClass {
  kind: 'class'
  key: string
  label: string
  count: number
  leaves: TreeLeaf[]
}

export interface TreeCategory {
  kind: 'category'
  k: number
  key: string
  classes: TreeClass[]
  unnamed: TreeLeaf[]
  count: number
}

export function buildTree(rows: IndexRow[]): TreeCategory[] {
  const byCategory = new Map<number, { classes: Map<string, TreeClass>; unnamed: TreeLeaf[] }>()

  for (const row of rows) {
    const bucket = byCategory.get(row.k) ?? { classes: new Map(), unnamed: [] }
    byCategory.set(row.k, bucket)

    const leaf: TreeLeaf = {
      kind: 'leaf',
      tag: row.t,
      name: row.n,
      repr: row.r,
      status: row.s,
    }
    const segments = row.n ? row.n.split('.').map((s) => s.trim()).filter(Boolean) : []
    if (segments.length < 2) {
      bucket.unnamed.push(leaf)
      continue
    }
    const objectClass = segments[0]
    const cls = bucket.classes.get(objectClass) ?? {
      kind: 'class',
      key: `${row.k}:${objectClass}`,
      label: objectClass,
      count: 0,
      leaves: [],
    }
    bucket.classes.set(objectClass, cls)
    cls.leaves.push(leaf)
    cls.count += 1
  }

  const sortLeaves = (a: TreeLeaf, b: TreeLeaf) => a.tag - b.tag
  return [...byCategory.entries()]
    .sort(([a], [b]) => a - b)
    .map(([k, bucket]) => {
      for (const cls of bucket.classes.values()) cls.leaves.sort(sortLeaves)
      bucket.unnamed.sort(sortLeaves)
      const classes = [...bucket.classes.values()].sort((a, b) =>
        a.label.localeCompare(b.label),
      )
      return {
        kind: 'category' as const,
        k,
        key: `cat-${k}`,
        classes,
        unnamed: bucket.unnamed,
        count: classes.reduce((n, c) => n + c.count, 0) + bucket.unnamed.length,
      }
    })
}

// Filter the tree by a query (name substring or tag prefix), keeping only
// branches that contain at least one match. An empty query returns the full
// tree (for rendering with collapsed state).
export function filterTree(
  tree: TreeCategory[],
  query: string,
): { tree: TreeCategory[]; matches: number } {
  const q = query.trim().toLowerCase()
  if (!q) return { tree, matches: 0 }
  let matches = 0
  const filtered = tree
    .map((cat) => {
      const classes = cat.classes
        .map((cls) => {
          const leaves = cls.leaves.filter((leaf) => {
            const tagMatch = /^\d{1,4}$/.test(q) && String(leaf.tag).startsWith(q)
            return tagMatch || leaf.name.toLowerCase().includes(q)
          })
          return { ...cls, leaves, count: leaves.length }
        })
        .filter((cls) => cls.count > 0)
      const unnamed = cat.unnamed.filter((leaf) =>
        /^\d{1,4}$/.test(q) && String(leaf.tag).startsWith(q))
      matches += classes.reduce((n, c) => n + c.count, 0) + unnamed.length
      return { ...cat, classes, unnamed, count: classes.reduce((n, c) => n + c.count, 0) + unnamed.length }
    })
    .filter((cat) => cat.count > 0)
  return { tree: filtered, matches }
}
