import { describe, expect, it } from 'vitest'
import {
  categoryOf,
  changeTagInfo,
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

  it('extracts the use-instead tag', () => {
    expect(replacementPointer(el('DE to use instead - 1000'))).toBe(1000)
  })

  it('ignores years and service elements', () => {
    expect(replacementPointer(el('mfd in TDED 1993 No business requirement'))).toBeNull()
    expect(replacementPointer(el('DE to use instead - 0004 /0010'))).toBeNull()
  })

  it('returns null for active elements', () => {
    expect(replacementPointer(el('see 1000', 'active'))).toBeNull()
  })
})

describe('reprSummary', () => {
  it('renders fixed and variable notations', () => {
    expect(reprSummary({ raw: 'an..3', charset: 'an', min_length: 1, max_length: 3 })).toBe('an..3')
    expect(reprSummary({ raw: 'n9', charset: 'n', min_length: 9, max_length: 9 })).toBe('n9')
    expect(reprSummary(null)).toBe('—')
  })
})
