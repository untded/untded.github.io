import { describe, expect, it } from 'vitest'
import { buildLedger, LEDGER_TAGS } from './ledgers'
import { loadElements } from './data'

describe('buildLedger on the real dataset', () => {
  const ledger = buildLedger(loadElements())

  it('curates twelve real renames across categories', () => {
    expect(ledger).toHaveLength(LEDGER_TAGS.length)
    expect(new Set(ledger.map((l) => Math.floor(l.tag / 1000))).size).toBeGreaterThanOrEqual(6)
  })

  it('opens with the canonical 1001 rename', () => {
    expect(ledger[0]).toEqual({
      tag: 1001,
      from: 'Document/message name, coded',
      to: 'Document. Type.Code',
    })
  })

  it('every line has both sides', () => {
    for (const line of ledger) {
      expect(line.from.length).toBeGreaterThan(0)
      expect(line.to.length).toBeGreaterThan(0)
    }
  })
})
