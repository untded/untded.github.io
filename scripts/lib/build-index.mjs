// Pure seam: full element records -> compact index rows.
// Wire format keys stay short (this file ships to every visitor):
// t=tag, n=name, r=representation raw, c=change tag, s=status, k=category (1-9)
export function toIndexRows(elements) {
  return elements.map((e) => ({
    t: e.tag,
    n: e.name ?? '',
    r: e.representation?.raw ?? '',
    c: e.change_tag,
    s: e.status === 'retired' ? 'r' : 'a',
    k: Math.floor(e.tag / 1000),
  }))
}
