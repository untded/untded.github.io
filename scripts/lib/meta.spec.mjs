import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { buildMeta, CATEGORIES } from './meta.mjs'

const source = JSON.parse(
  readFileSync(fileURLToPath(new URL('../../data-source/elements.json', import.meta.url)), 'utf8'),
)

describe('buildMeta on the real dataset', () => {
  const meta = buildMeta(source.elements)

  it('counts the full directory', () => {
    expect(meta.count).toBe(1504)
  })

  it('covers nine categories that sum to the total', () => {
    expect(CATEGORIES).toHaveLength(9)
    expect(meta.categories.reduce((n, c) => n + c.count, 0)).toBe(meta.count)
  })

  it('groups change tags into added/changed/undeleted/retired', () => {
    expect(meta.groups).toEqual({ added: 461, changed: 853, undeleted: 4, retired: 186 })
  })
})
