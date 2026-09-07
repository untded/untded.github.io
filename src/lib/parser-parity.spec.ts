// Parser parity: the TypeScript ports must reproduce the Ruby parse of
// the same printed source. data-source/parser-fixtures.json is written
// by the dataset's bin/export (Untded::Bridges / UnlkZones / Replacement
// over a fixed sample of real elements — every edge case the Ruby specs
// pin: colon-less scheme print, zero-clamped positions, lowercase
// position tokens, multi-scheme bridges, replacement guards). If the
// two ports drift, this spec goes red at the next sync-data.
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import type { ElementRecord } from './data'
import { loadElements } from './data'
import { parseBridges, replacementPointer } from './element'
import { unlkZones } from './unlk'

interface FixtureCase {
  tag: number
  status: 'active' | 'retired'
  notes: string | null
  bridges: string | null
  entries: { scheme: string; detail: string }[]
  zones: { lineFrom: number; lineTo: number; posFrom: number; posTo: number; format?: string }[]
  replacement: number | null
}

const doc = JSON.parse(
  readFileSync(resolve(process.cwd(), 'data-source/parser-fixtures.json'), 'utf8'),
) as { cases: FixtureCase[] }

const tags = new Set(loadElements().map((e) => e.tag))

describe('parser parity with the dataset (fixtures from bin/export)', () => {
  it('carries the edge-case sample', () => {
    expect(doc.cases.map((c) => c.tag).sort()).toEqual([1002, 1004, 1082, 1128, 1188, 2025, 5010])
  })

  for (const c of doc.cases) {
    it(`tag ${c.tag}: bridges, zones and replacement parse identically`, () => {
      expect(parseBridges(c.bridges)).toEqual(c.entries)
      expect(unlkZones(c.bridges)).toEqual(c.zones)
      const element = { tag: c.tag, status: c.status, notes: c.notes } as unknown as ElementRecord
      expect(replacementPointer(element, tags)).toBe(c.replacement)
    })
  }
})
