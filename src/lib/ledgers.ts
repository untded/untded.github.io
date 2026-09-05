// Deterministic curation of rename-ledger lines (home hero): real
// 1993→2005 renames, spread across categories, short enough to read at
// a glance. Curated from the dataset on 2026-09-05; verify against
// data-source with the spec below.
export interface LedgerLine {
  tag: number
  from: string
  to: string
}

export const LEDGER_TAGS = [
  1001, 1070, 1131, 2005, 2380, 3229, 4225, 5004, 5305, 7004, 8249, 9013,
] as const

export function buildLedger(
  elements: { tag: number; name: string | null; old_name: string | null }[],
): LedgerLine[] {
  const byTag = new Map(elements.map((e) => [e.tag, e]))
  return LEDGER_TAGS.flatMap((tag) => {
    const e = byTag.get(tag)
    if (!e?.name || !e.old_name) return []
    return [{ tag, from: e.old_name, to: e.name }]
  })
}
