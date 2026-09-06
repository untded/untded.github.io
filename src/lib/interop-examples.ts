// Worked JSON-LD examples for the context guide. One writer: the docs
// page renders them, the spec suite validates them against the real
// context and the real element data.
import { href } from './site'

const origin = 'https://www.untded.org'

/** A supply-chain message citing a TDED element by IRI, EDIFACT-adjacent. */
export const alignmentExample = {
  '@context': 'https://www.untded.org/ns/untded-context.jsonld',
  '@id': 'https://example.org/docs/INV-2026-0331',
  '@type': 'Document',
  name: 'Commercial invoice INV-2026-0331',
  "https://example.org/vocab#cites": {
    '@id': `${origin}/elements/1004`,
    name: 'Document. Identifier',
    representation: {
      '@type': 'Representation',
      printedForm: 'an..35',
      charset: 'an',
      minLength: 1,
      maxLength: 35,
    },
  },
}

/** A product-passport-shaped payload citing data elements by IRI. */
export const passportExample = {
  '@context': 'https://www.untded.org/ns/untded-context.jsonld',
  '@id': 'https://example.org/passports/battery-pack-42',
  '@type': 'ProductPassport',
  name: 'Battery pack 42',
  "https://example.org/vocab#declares": [
    {
      '@id': `${origin}/elements/7233`,
      name: 'Item. Description.Text',
    },
    {
      '@id': `${origin}/elements/6245`,
      name: 'Item. Gross Weight.Measure',
    },
  ],
}

export const contextUrl = `${origin}/ns/untded-context.jsonld`
