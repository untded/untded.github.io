// Dist-based page contracts. The vitest globalSetup (scripts/
// test-global-setup.mjs) rebuilds when any build input is newer than
// dist/, so the suite can never assert against a stale build. Skips
// automatically when dist/ is absent so the same suite works in
// validate-only contexts.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import astroConfig from '../../astro.config.mjs'
import { loadElements } from './data'
import { loadCategories as CATEGORY_RANGES } from './element'

const site = astroConfig.site as string
const dist = 'dist'
const elements = loadElements()
const hasDist = existsSync(dist)

describe.skipIf(!hasDist)('site contracts (dist)', () => {
  it('builds every element route', () => {
    for (const e of elements) {
      const p = `${dist}/elements/${e.tag}/index.html`
      expect(existsSync(p), `missing ${p}`).toBe(true)
    }
  })

  it('builds every category route and the core pages', () => {
    for (const c of CATEGORY_RANGES()) {
      expect(existsSync(`${dist}/categories/${c.range}/index.html`)).toBe(true)
    }
    for (const p of ['index.html', 'about/index.html', 'notation/index.html', 'download/index.html', 'search/index.html', 'document/index.html', 'elements/index.html', '404.html']) {
      expect(existsSync(`${dist}/${p}`), `missing ${p}`).toBe(true)
    }
  })

  it('ships the runtime data payloads', () => {
    const index = JSON.parse(readFileSync(`${dist}/data/index.json`, 'utf8'))
    expect(index).toHaveLength(elements.length)
    expect(JSON.parse(readFileSync(`${dist}/data/meta.json`, 'utf8')).count).toBe(elements.length)
  })

  it('ships the linked-data payloads and embeds JSON-LD on pages', () => {
    const jsonld = JSON.parse(readFileSync(`${dist}/data/untded.jsonld`, 'utf8'))
    expect(jsonld['@graph'].length).toBeGreaterThan(elements.length)
    expect(readFileSync(`${dist}/data/untded.ttl`, 'utf8')).toMatch(/^@prefix .*utd: <https:\/\/www\.untded\.org\/ns\/untded#>/m)
    const elementHtml = readFileSync(`${dist}/elements/1001/index.html`, 'utf8')
    expect(elementHtml).toContain('application/ld+json')
    expect(elementHtml).toContain('TradeDataElement')
    expect(readFileSync(`${dist}/index.html`, 'utf8')).toContain('application/ld+json')
  })

  it('serves dereferenceable per-element RDF with alternate links', () => {
    for (const tag of [1000, 1001, 9649]) {
      const jsonld = JSON.parse(readFileSync(`${dist}/elements/${tag}/data.jsonld`, 'utf8'))
      expect(jsonld['@id']).toBe(`${site}/elements/${tag}`)
      expect(readFileSync(`${dist}/elements/${tag}/data.ttl`, 'utf8')).toContain(`<${site}/elements/${tag}> a utd:TradeDataElement`)
    }
    const ttlCount = readdirSync(`${dist}/elements`).filter((d) =>
      existsSync(`${dist}/elements/${d}/data.ttl`),
    ).length
    expect(ttlCount).toBe(elements.length)
    const html = readFileSync(`${dist}/elements/1000/index.html`, 'utf8')
    expect(html).toContain('rel="alternate" type="application/ld+json" href="/elements/1000/data.jsonld"')
    expect(html).toContain(`${site}/elements/1000`)
    expect(html).toContain('Copy IRI')
  })

  it('builds the original-documentation pages', () => {
    for (const p of ['document/index.html', 'document/introduction/index.html', 'document/maintenance/index.html', 'document/presentation/index.html']) {
      expect(existsSync(`${dist}/${p}`), p).toBe(true)
    }
    const presentation = readFileSync(`${dist}/document/presentation/index.html`, 'utf8')
    expect(presentation).toContain('The change indicator marks shall be')
    expect(presentation).toContain('marked for deletion')
  })


it('embeds category nodes with ontology relations', () => {
  const html = readFileSync(`${dist}/categories/1000-1699/index.html`, 'utf8')
  expect(html).toContain('application/ld+json')
  expect(html).toContain('tagRange')
  const jsonld = JSON.parse(readFileSync(`${dist}/data/untded.jsonld`, 'utf8'))
  const cat = jsonld['@graph'].find((n: Record<string, unknown>) => n['@id'] === `${site}/categories/1000-1699`)
  expect(cat).toMatchObject({ '@type': 'Category', tagRange: '1000-1699', position: 1 })
  const el = jsonld['@graph'].find((n: Record<string, unknown>) => n['@id'] === `${site}/elements/1001`)
  expect(el.category?.['@id']).toBe(`${site}/categories/1000-1699`)
})

it('is self-describing: every used utd: term is declared in the graph', () => {
  const jsonld = JSON.parse(readFileSync(`${dist}/data/untded.jsonld`, 'utf8'))
  const ns = 'https://www.untded.org/ns/untded#'
  const context: Record<string, string> = jsonld['@context']
  const nodes: Record<string, unknown>[] = jsonld['@graph']
  const usedPredicates = nodes.flatMap((n) => Object.keys(n).filter((k) => !k.startsWith('@'))).map((t) => context[t])
  const utdPredicates = [...new Set(usedPredicates.filter((iri) => iri?.startsWith('utd:')))]
  const declaredProperties = new Set(nodes.filter((n) => n['@type'] === 'rdf:Property').map((n) => String(n['@id'])))
  expect(utdPredicates.length).toBeGreaterThan(0)
  for (const iri of utdPredicates) expect(declaredProperties, iri).toContain(ns + iri.slice(4))

  const usedClasses = [...new Set(nodes.flatMap((n) => Array.isArray(n['@type']) ? n['@type'] : [n['@type']]).map((t) => context[String(t)]))]
  const utdClasses = usedClasses.filter((iri) => iri?.startsWith('utd:'))
  const declaredClasses = new Set(nodes.filter((n) => n['@type'] === 'rdfs:Class').map((n) => String(n['@id'])))
  for (const iri of utdClasses) expect(declaredClasses, iri).toContain(ns + iri.slice(4))
})

it('emits breadcrumb structured data on element pages', () => {
  const html = readFileSync(`${dist}/elements/1001/index.html`, 'utf8')
  expect(html).toContain('BreadcrumbList')
  expect(html).toContain(`${site}/categories/1000-1699`)
})


it("builds the tree page and serves the source PDFs", () => {
  expect(existsSync(`${dist}/tree/index.html`)).toBe(true)
  expect(readFileSync(`${dist}/tree/index.html`, "utf8")).toContain("The name tree")
  expect(existsSync(`${dist}/pdf/UNTDED2005.pdf`)).toBe(true)
  expect(readFileSync(`${dist}/elements/1001/index.html`, "utf8")).toContain(`pdf/UNTDED2005.pdf#page=`)
})

it("ships the theme system, footer logos and sharing metadata", () => {
  const html = readFileSync(`${dist}/index.html`, "utf8")
  expect(html).toContain("untded-theme")
  expect(html).toContain("astro:after-swap")
  expect(html).toContain("theme-toggle")
  expect(html).toContain("logo-unece.svg")
  expect(html).toContain("logo-iso.svg")
  expect(html).toContain("og:image")
  expect(html).toContain("twitter:card")
  expect(readFileSync(`${dist}/robots.txt`, "utf8")).toContain(`Sitemap: ${site}/sitemap-index.xml`)
})

it("carries the full original documentation", () => {
  expect(readFileSync(`${dist}/document/introduction/index.html`, "utf8")).toContain("Rec. No. 25")
  expect(readFileSync(`${dist}/document/presentation/index.html`, "utf8")).toContain("Group 9")
  expect(readFileSync(`${dist}/document/maintenance/index.html`, "utf8")).toContain("shall not be re-used")
})

  it('ships the favicon set (SVG emblem + PNG fallbacks)', () => {
    expect(readFileSync(`${dist}/favicon.svg`, 'utf8')).toContain('<svg')
    for (const f of ['favicon-32.png', 'favicon-16.png', 'apple-touch-icon.png']) {
      expect(existsSync(`${dist}/${f}`), f).toBe(true)
    }
    expect(readFileSync(`${dist}/index.html`, 'utf8')).toContain('apple-touch-icon')
  })

  it('keeps the no-JS directory sample lean and signposts categories', () => {
    const html = readFileSync(`${dist}/elements/index.html`, 'utf8')
    const rows = html.match(/<tr\b/g)?.length ?? 0
    expect(rows).toBeGreaterThanOrEqual(40)
    expect(html).toContain('/categories/1000-1699')
    expect(html).toContain('/tree')
    expect(statSync(`${dist}/elements/index.html`).size).toBeLessThan(60_000)
  })

  it('covers every element with the nine synced categories', () => {
    const cats = CATEGORY_RANGES()
    expect(cats).toHaveLength(9)
    expect(cats.map((c) => c.range).join(',')).toBe('1000-1699,2000-2699,3000-3699,4000-4699,5000-5699,6000-6699,7000-7699,8000-8699,9000-9699')
    for (const e of elements) {
      const c = cats[Math.floor(e.tag / 1000) - 1]
      expect(c, String(e.tag)).toBeDefined()
      expect(e.tag, `${e.tag} outside ${c.range}`).toBeGreaterThanOrEqual(Number(c.range.slice(0, 4)))
      expect(e.tag).toBeLessThanOrEqual(Number(c.range.slice(5)))
    }
  })

  it('sitemaps the element and category routes', () => {
    const sitemap = readFileSync(`${dist}/sitemap-index.xml`, 'utf8')
    expect(sitemap).toContain('<loc>')
    const main = readFileSync(`${dist}/sitemap-0.xml`, 'utf8')
    expect(main).toContain(`${site}/elements/1001`)
    expect(main).toContain(`${site}/categories/1000-1699`)
    const count = (main.match(/\/elements\/\d{4}<\/loc>/g) ?? []).length
    expect(count).toBe(elements.length)
  })

  it('retired entries carry their replacement pointer', () => {
    const html = readFileSync(`${dist}/elements/1002/index.html`, 'utf8')
    expect(html).toContain('href="/elements/1000"')
  })

  it('cites the mandate verbatim on the about page', () => {
    const html = readFileSync(`${dist}/about/index.html`, 'utf8')
    expect(html).toContain('Resolution P-2026-07')
    expect(html).toContain('N1727')
  })

  it('respects the HTML payload budget', () => {
    const budgets: [string, number][] = [
      [`${dist}/elements/1001/index.html`, 30_000],
      [`${dist}/index.html`, 40_000],
      [`${dist}/elements/index.html`, 700_000],
      [`${dist}/about/index.html`, 40_000],
      [`${dist}/document/presentation/index.html`, 40_000],
    ]
    for (const [p, max] of budgets) {
      expect(statSync(p).size, `${p} over budget`).toBeLessThan(max)
    }
  })

  it('indexes the site for full-text search', () => {
    const entries = readdirSync(`${dist}/pagefind`)
    expect(entries).toContain('pagefind-entry.json')
  })

  it('brands every page UN/TDED and never the old stylisation', () => {
    const pages = ['index.html', 'about/index.html', 'elements/1001/index.html', '404.html']
    for (const p of pages) {
      const html = readFileSync(`${dist}/${p}`, 'utf8')
      expect(html).toContain('name-slash')
      expect(html).not.toContain('unt·ded')
    }
  })

  it('shows both organization cards with logos on the about page', () => {
    const html = readFileSync(`${dist}/about/index.html`, 'utf8')
    expect(html).toContain('img/logo-unece.svg')
    expect(html).toContain('img/logo-iso.svg')
    expect(html).toContain('UNECE — UN/CEFACT')
    expect(html).toContain('ISO/TC 154')
  })

  it('links adjacent elements on element pages', () => {
    const html = readFileSync(`${dist}/elements/1001/index.html`, 'utf8')
    expect(html).toContain('href="/elements/1000"')
    expect(html).toContain('href="/elements/1002"')
  })

  // Astro collapses whitespace between text and elements across newlines,
  // which once produced "theUnited Nations" on every page. This contract
  // fails on any recurrence of that bug class. The UN/TDED slash is the
  // one intentional no-space pattern and is neutralised before checking.
  it('renders no collapsed text/element boundaries', () => {
    const files = collectHtml(dist)
    const broken: string[] = []
    const tags = '(a|kbd|strong|em|code|span|small|sup|sub|b|i|abbr|cite)'
    const re = new RegExp(`</${tags}>(?=[A-Za-z])|(?<=[a-z…,)”])<${tags}[\\s>]`)
    for (const f of files) {
      const html = readFileSync(f, 'utf8')
        .replace(/<span[^>]*name-slash[^>]*>\/<\/span>/g, '/')
        .replace(/<script[\s\S]*?<\/script>/g, '')
        .replace(/<style[\s\S]*?<\/style>/g, '')
      const m = html.match(re)
      if (m) broken.push(`${f.replace(`${dist}/`, '')}: ${JSON.stringify(m[0].slice(0, 40))}`)
    }
    expect(broken, broken.join('\n')).toEqual([])
  })
})

function collectHtml(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = `${dir}/${name}`
    if (name === 'pagefind' || name === '_astro') return []
    return statSync(p).isDirectory() ? collectHtml(p) : p.endsWith('.html') ? [p] : []
  })
}
