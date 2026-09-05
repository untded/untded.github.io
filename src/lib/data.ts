// The single data seam: every page/component reads the dataset through
// this module. Full element records come from the committed
// data-source/elements.json (synced from untded/untded-2005); the
// compact runtime index under /data/index.json is the same data in wire
// format (see scripts/lib/build-index.mjs).
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

export interface Representation {
  raw: string
  charset: string
  min_length: number
  max_length: number
}

export interface Provenance {
  pdf: string
  page: number
  confidence: 'high' | 'medium' | 'low'
}

export interface ElementRecord {
  tag: number
  name: string | null
  name_fr: string | null
  description: string | null
  representation: Representation | null
  change_tag: string
  status: 'active' | 'retired'
  old_name: string | null
  business_term: string | null
  notes: string | null
  bridges: string | null
  code_list: { reference: string } | null
  provenance: Provenance
}

export interface IndexRow {
  t: number
  n: string
  r: string
  c: string
  s: 'a' | 'r'
  k: number
}

interface DatasetFile {
  elements: ElementRecord[]
}

let cache: ElementRecord[] | null = null

export function loadElements(): ElementRecord[] {
  if (cache === null) {
    // dev and build both run from the repo root; build-time chunks move,
    // so resolve against cwd rather than import.meta.url
    const file = JSON.parse(
      readFileSync(resolve(process.cwd(), 'data-source/elements.json'), 'utf8'),
    ) as DatasetFile
    cache = file.elements
  }
  return cache
}

export function elementByTag(tag: number): ElementRecord | undefined {
  return loadElements().find((e) => e.tag === tag)
}
