import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { alignmentExample, contextUrl, passportExample } from './interop-examples'

const context = JSON.parse(
  readFileSync(resolve(process.cwd(), 'data-source/context.jsonld'), 'utf8'),
)
const elements = JSON.parse(
  readFileSync(resolve(process.cwd(), 'data-source/elements.json'), 'utf8'),
)
const elementIds = new Set(elements.elements.map((e: { tag: number }) => `https://www.untded.org/elements/${e.tag}`))

// Minimal expansion check: every plain term must be in the live context,
// and every cited element IRI must exist in the real data.
function checkDoc(doc: Record<string, unknown>) {
  expect(doc['@context']).toBe(contextUrl)
  const walk = (node: Record<string, unknown> | unknown[]) => {
    if (Array.isArray(node)) {
      for (const item of node) if (item && typeof item === 'object') walk(item as Record<string, unknown>)
      return
    }
    for (const [key, value] of Object.entries(node)) {
      if (key.startsWith('@')) {
        if (key === '@id' && typeof value === 'string' && value.includes('/elements/')) {
          expect(elementIds.has(value as string), `unknown element IRI ${value}`).toBe(true)
        }
      } else if (!key.startsWith("http")) {
        expect(Object.hasOwn(context, key), `term "${key}" missing from the context`).toBe(true)
      }
      if (typeof value === 'object' && value !== null) walk(value as Record<string, unknown>)
    }
  }
  walk(doc)
}

describe('interop examples', () => {
  it('expands the EDIFACT-adjacent example against the live context', () => {
    checkDoc(alignmentExample)
  })

  it('expands the product-passport example against the live context', () => {
    checkDoc(passportExample)
  })
})
