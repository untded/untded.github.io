// data-source/uncl-refs.json — section-4.1.5 cross-references from the
// full-text UNCL D.01B mirror (dataset bin/join-uncl-refs). A code whose
// description starts with [nnnn] equals TDED element nnnn; remaining
// [nnnn]/(nnnn) are related. Vintage D.01B, labeled as such.
import { loadJson } from './data'

export interface UnclRef {
  code_list: number
  code: string
  name: string
  kind: 'equals' | 'related'
  description: string | null
}

export interface UnclRefLink {
  tag: number
  refs: UnclRef[]
}

export function loadUnclRefs(): Map<number, UnclRef[]> {
  const doc = loadJson<{ links: UnclRefLink[] }>('uncl-refs.json')
  return new Map(doc.links.map((l) => [l.tag, l.refs]))
}
