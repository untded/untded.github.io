import { describe, expect, it } from 'vitest'
import { toIndexRows } from './build-index.mjs'

const element = (over = {}) => ({
  tag: 1001,
  name: 'Document. Type.Code',
  description: 'd',
  representation: { raw: 'an..3', charset: 'an', min_length: 1, max_length: 3 },
  change_tag: 'cndr',
  status: 'active',
  provenance: { pdf: 'p', page: 28, confidence: 'medium' },
  ...over,
})

describe('toIndexRows', () => {
  it('maps to the compact wire format', () => {
    expect(toIndexRows([element()])).toEqual([
      { t: 1001, n: 'Document. Type.Code', r: 'an..3', c: 'cndr', s: 'a', k: 1 },
    ])
  })

  it('tolerates missing name and representation', () => {
    const rows = toIndexRows([element({ name: null, representation: null })])
    expect(rows[0]).toMatchObject({ n: '', r: '' })
  })
})
