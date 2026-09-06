// Pure seam: dataset aggregates. The nine TDED tag ranges are read from
// src/data/categories.json — the single category definition shared with
// the site's domain lib (src/lib/element.ts). Read lazily from cwd
// because this module is also bundled into build chunks, where
// import.meta.url-relative paths no longer resolve.
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

let cache = null
export function categories() {
  if (cache === null) {
    cache = JSON.parse(readFileSync(resolve(process.cwd(), 'src/data/categories.json'), 'utf8'))
  }
  return cache
}

const CHANGE_GROUPS = {
  added: ['add'],
  changed: ['cnd', 'cndr', 'cnr', 'cn', 'cr', 'cdr', 'cd'],
  undeleted: ['u'],
  retired: ['x'],
}

export function buildMeta(elements) {
  const byCategory = Object.fromEntries(
    categories().map((c) => {
      const inRange = elements.filter((e) => Math.floor(e.tag / 1000) === c.k)
      return [
        c.k,
        {
          ...c,
          count: inRange.length,
          active: inRange.filter((e) => e.status === 'active').length,
          groups: groupTally(inRange),
        },
      ]
    }),
  )
  const changeTagTally = tally(elements.map((e) => e.change_tag))
  return {
    count: elements.length,
    categories: categories().map((c) => byCategory[c.k]),
    changeTagTally,
    groups: groupTally(elements),
  }
}

function groupTally(elements) {
  const t = tally(elements.map((e) => e.change_tag))
  return {
    added: CHANGE_GROUPS.added.reduce((n, tag) => n + (t[tag] ?? 0), 0),
    changed: CHANGE_GROUPS.changed.reduce((n, tag) => n + (t[tag] ?? 0), 0),
    undeleted: CHANGE_GROUPS.undeleted.reduce((n, tag) => n + (t[tag] ?? 0), 0),
    retired: CHANGE_GROUPS.retired.reduce((n, tag) => n + (t[tag] ?? 0), 0),
  }
}

function tally(values) {
  return values.reduce((acc, v) => ((acc[v] = (acc[v] ?? 0) + 1), acc), {})
}
