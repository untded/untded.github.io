import { describe, expect, it } from 'vitest'
import {
  categoryOf,
  formatBridgeDetail,
  changeTagInfo,
  neighbours,
  pairedTag,
  parseBridges,
  reprSummary,
  replacementPointer,
} from './element'

describe('changeTagInfo', () => {
  it('labels the legend tags', () => {
    expect(changeTagInfo('add').label).toBe('Added')
    expect(changeTagInfo('u').label).toBe('Undeleted (re-instated)')
    expect(changeTagInfo('cndr').label).toBe('Changed name + description + representation')
    expect(changeTagInfo('x').label).toBe('Marked for deletion')
  })

  it('flags tags outside the printed legend', () => {
    expect(changeTagInfo('cr').outsideLegend).toBe(true)
    expect(changeTagInfo('cnd').outsideLegend).toBe(false)
  })
})

describe('categoryOf', () => {
  it('resolves the nine tag ranges', () => {
    expect(categoryOf(1000).k).toBe(1)
    expect(categoryOf(9649).k).toBe(9)
    expect(categoryOf(5305).label).toBe('Amounts, charges, percentages')
  })
})

describe('parseBridges', () => {
  it('splits the bridges column per scheme', () => {
    expect(parseBridges('UNLK: L 04, P 41-45 CIMP: (120): a1 SAD: (SAD 1)')).toEqual([
      { scheme: 'UNLK', detail: 'L 04, P 41-45' },
      { scheme: 'CIMP', detail: '(120): a1' },
      { scheme: 'SAD', detail: '(SAD 1)' },
    ])
  })

  it('returns empty for absent bridges', () => {
    expect(parseBridges(null)).toEqual([])
    expect(parseBridges('')).toEqual([])
  })
})

describe('replacementPointer', () => {
  const el = (notes: string | null, status = 'retired') =>
    ({ notes, status }) as never
  const tags = new Set([1000])

  it('extracts the use-instead tag', () => {
    expect(replacementPointer(el('DE to use instead - 1000'), tags)).toBe(1000)
  })

  it('ignores tags absent from this edition', () => {
    expect(replacementPointer(el('DE to use instead - 1056'), tags)).toBeNull()
  })

  it('ignores years and service elements', () => {
    expect(replacementPointer(el('mfd in TDED 1993 No business requirement'), tags)).toBeNull()
    expect(replacementPointer(el('DE to use instead - 0004 /0010'), tags)).toBeNull()
  })

  it('returns null for active elements', () => {
    expect(replacementPointer(el('see 1000', 'active'), tags)).toBeNull()
  })
})

describe('reprSummary', () => {
  it('renders fixed and variable notations', () => {
    expect(reprSummary({ raw: 'an..3', charset: 'an', min_length: 1, max_length: 3 })).toBe('an..3')
    expect(reprSummary({ raw: 'n9', charset: 'n', min_length: 9, max_length: 9 })).toBe('n9')
    expect(reprSummary(null)).toBe('—')
  })
})

describe('neighbours', () => {
  it('walks document order', () => {
    expect(neighbours(2000, [1000, 2000, 3000])).toEqual({ prev: 1000, next: 3000 })
    expect(neighbours(1000, [1000, 2000])).toEqual({ prev: null, next: 2000 })
    expect(neighbours(2000, [1000, 2000])).toEqual({ prev: 1000, next: null })
    expect(neighbours(9999, [1000])).toEqual({ prev: null, next: null })
  })
})

describe('pairedTag', () => {
  it('pairs even text tags with the following odd coded tag', () => {
    const tags = new Set([1000, 1001, 1004])
    expect(pairedTag(1000, tags)).toBe(1001)
    expect(pairedTag(1001, tags)).toBe(1000)
    // 1002 absent -> 1004 has no coded counterpart in this edition
    expect(pairedTag(1004, tags)).toBeNull()
    expect(pairedTag(9999, tags)).toBeNull()
  })
})

describe('formatBridgeDetail', () => {
  it('parses line, positions and format', () => {
    expect(formatBridgeDetail('an..17 L 04, P 63-80')).toEqual([
      { kind: 'format', text: 'an..17' },
      { kind: 'lines', from: 4, to: null },
      { kind: 'text', text: ',' },
      { kind: 'positions', from: 63, to: 80 },
    ])
  })

  it('parses ranges and spaced hyphens as printed', () => {
    expect(formatBridgeDetail('L 36-64, P 09-26')).toEqual([
      { kind: 'lines', from: 36, to: 64 },
      { kind: 'text', text: ',' },
      { kind: 'positions', from: 9, to: 26 },
    ])
    expect(formatBridgeDetail('P 45 - 61')).toEqual([
      { kind: 'positions', from: 45, to: 61 },
    ])
  })

  it('keeps protocol codes as text', () => {
    expect(formatBridgeDetail('(112): n3; (113): n8 or (119): n8')).toEqual([
      { kind: 'text', text: '(112):' },
      { kind: 'format', text: 'n3' },
      { kind: 'text', text: '; (113):' },
      { kind: 'format', text: 'n8' },
      { kind: 'text', text: 'or (119):' },
      { kind: 'format', text: 'n8' },
    ])
  })
})

describe('parseBridges (colon-less print)', () => {
  it('recognizes the scheme printed without a colon at the start of the cell (element 5010)', () => {
    expect(parseBridges('UNLK L 24, P45-80')).toEqual([{ scheme: 'UNLK', detail: 'L 24, P45-80' }])
  })
})
