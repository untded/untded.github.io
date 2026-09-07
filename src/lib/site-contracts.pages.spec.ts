// Dist-based page contracts. The vitest globalSetup (scripts/
// test-global-setup.mjs) rebuilds when any build input is newer than
// dist/, so the suite can never assert against a stale build. Skips
// automatically when dist/ is absent so the same suite works in
// validate-only contexts.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import astroConfig from '../../astro.config.mjs'
import { loadElements } from './data'
import { loadCategories as CATEGORY_RANGES } from './data'

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
  expect(html).toContain("logo-unece-light.svg")
  expect(html).toContain("logo-unece-dark.svg")
  expect(html).toContain("logo-iso-light.svg")
  expect(html).toContain("logo-iso-dark.svg")
  expect(html).toContain("https://unece.org/untded-iso7372")
  expect(html).toContain("https://www.iso.org/standard/41237.html")
  expect(html).toContain("og:image")
  expect(html).toContain("twitter:card")
  expect(readFileSync(`${dist}/robots.txt`, "utf8")).toContain(`Sitemap: ${site}/sitemap-index.xml`)
})

it("carries the full original documentation", () => {
  expect(readFileSync(`${dist}/document/introduction/index.html`, "utf8")).toContain("Rec. No. 25")
  expect(readFileSync(`${dist}/document/presentation/index.html`, "utf8")).toContain("Group 9")
  expect(readFileSync(`${dist}/document/maintenance/index.html`, "utf8")).toContain("shall not be re-used")
  const html = readFileSync(`${dist}/document/index.html`, "utf8")
  expect(html).toContain("https://unece.org/untded-iso7372")
  expect(html).toContain("https://www.iso.org/standard/41237.html")
})

  it('ships the favicon set (RealFaviconGenerator package)', () => {
    for (const f of ['favicon.svg', 'favicon-96x96.png', 'favicon.ico', 'apple-touch-icon.png',
                     'web-app-manifest-192x192.png', 'web-app-manifest-512x512.png', 'site.webmanifest']) {
      expect(existsSync(`${dist}/${f}`), f).toBe(true)
    }
    const manifest = JSON.parse(readFileSync(`${dist}/site.webmanifest`, 'utf8'))
    expect(manifest.name).toContain('UN/TDED')
    const html = readFileSync(`${dist}/index.html`, 'utf8')
    expect(html).toContain('favicon.svg?v=20260906')
    expect(html).toContain('favicon-dark.svg')
    expect(readFileSync(`${dist}/favicon-dark.svg`, 'utf8')).toContain('#4bccff')
    expect(html).toContain('favicon.ico')
    expect(html).toContain('site.webmanifest')
    expect(html).toContain('apple-touch-icon')
  })

  it('shows the UN emblem in the header (light and dark variants)', () => {
    const html = readFileSync(`${dist}/index.html`, 'utf8')
    expect(html).toContain('img/un-logo-light.svg')
    expect(html).toContain('img/un-logo-dark.svg')
    expect(existsSync(`${dist}/img/un-logo-dark.svg`)).toBe(true)
  })

  it('never opens a dialog from copy buttons', () => {
    const html = readFileSync(`${dist}/elements/1128/index.html`, 'utf8')
    expect(html).not.toContain('window.prompt')
    expect(html).toContain('execCommand')
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

  it('builds the UN layout key reconstruction', () => {
    const html = readFileSync(`${dist}/unlk/index.html`, 'utf8')
    expect(html).toContain('The UN layout key')
    expect(html).toContain('ISO 6422')
    expect((html.match(/<title>/g) ?? []).length).toBeGreaterThanOrEqual(100)
    expect(html).toContain('id="unlk-fields"')
    expect(html).toContain('aria-label="Zoom in"')
    expect(html).toContain('data-zone=')
    expect(html).toContain('Sections of the model form')
    expect(statSync(`${dist}/unlk/index.html`).size).toBeLessThan(150_000)
    expect(readFileSync(`${dist}/index.html`, 'utf8')).toContain('href="/unlk"')
  })

  it('shows the element location on the UN layout key', () => {
    const html = readFileSync(`${dist}/elements/1128/index.html`, 'utf8')
    expect(html).toContain('On the UN layout key')
    expect(html).toContain('positions 63–80')
    expect(html).toContain('unlk#field=4:4:63:80')
  })

  it('publishes the ontology page from the vocabulary declaration', () => {
    const html = readFileSync(`${dist}/ontology/index.html`, 'utf8')
    expect(html).toContain('The UNTDED ontology')
    expect(html).toContain('https://www.untded.org/ns/untded#')
    expect(html).toContain('utd:TradeDataElement')
    expect(html).toContain('utd:UnlkZone')
    expect(html).toContain('/data/untded.ttl')
    expect(html).toContain('/ns/untded-context.jsonld')
    expect(readFileSync(`${dist}/index.html`, 'utf8')).toContain('href="/ontology"')
  })

  it('publishes the edition ledger with replacements', () => {
    const html = readFileSync(`${dist}/ledger/index.html`, 'utf8')
    expect(html).toContain('The 1993–2005 ledger')
    expect(html).toContain('id="tag-cndr"')
    expect(html).toContain('href="/elements/1000"')
    expect(readFileSync(`${dist}/elements/1128/index.html`, 'utf8')).toContain('/ledger#tag-cndr')
  })

  it('publishes the bridges map with per-scheme sections', () => {
    const html = readFileSync(`${dist}/bridges/index.html`, 'utf8')
    expect(html).toContain('Bridges by scheme')
    expect(html).toContain('IMO Model forms and ICS Standard Bill of Lading')
    expect(html).toContain('id="UNLK"')
    expect((html.match(/href="\/elements\/\d{4}"/g) ?? []).length).toBeGreaterThan(500)
    expect(readFileSync(`${dist}/elements/1004/index.html`, 'utf8')).toContain('href="/bridges#UNLK"')
  })

  it('crosslinks elements to UN/EDIFACT EDED entries', () => {
    const html = readFileSync(`${dist}/elements/1004/index.html`, 'utf8')
    expect(html).toContain('EDED 1004')
    expect(html).toContain('aligned')
    expect(html).toContain('/docs/alignment-edifact')
    expect(html).toContain('Machine formats:')
    expect(html).toContain('data.ttl')

    const differs = readFileSync(`${dist}/elements/2000/index.html`, 'utf8')
    expect(differs).toContain('EDED 2000')
    expect(differs).toContain('representation differs')

    const unmapped = readFileSync(`${dist}/elements/9011/index.html`, 'utf8')
    expect(unmapped).not.toContain('EDED 9011')
  })

  it('dresses the long tables as ledger tables with checkable totals', () => {
    for (const p of ['ontology/index.html', 'ledger/index.html', 'bridges/index.html', 'docs/alignment-edifact/index.html']) {
      const html = readFileSync(`${dist}/${p}`, 'utf8')
      expect(html, p).toContain('ledger-table')
    }
    const bridges = readFileSync(`${dist}/bridges/index.html`, 'utf8')
    expect(bridges).toContain('>Total</td>')
    expect(bridges).toContain('tabular-nums text-ink">') // totals column present
  })

  it('carries the docs table of contents and one chip row', () => {
    const docs = readFileSync(`${dist}/docs/alignment-edifact/index.html`, 'utf8')
    expect(docs).toContain('On this page')
    expect(docs).toContain('href="#code-lists-uncl"')
    const e3055 = readFileSync(`${dist}/elements/3055/index.html`, 'utf8')
    expect(e3055).toContain('flex flex-wrap items-center gap-2')
    expect(e3055).toContain('EDED 3055')
    expect(e3055).toContain('UNCL D05B')
  })

  it('makes the UNLK explorer operable by keyboard', () => {
    const html = readFileSync(`${dist}/unlk/index.html`, 'utf8')
    expect(html).toContain('Keyboard: arrow keys pan')
    expect(html).toMatch(/<svg id="unlk-svg"[\s\S]{0,700}?tabindex="0"/)
    expect(html).toContain("plus and minus zoom, 0 resets")
  })

  it('shows UNCL code coverage on coded elements only', () => {
    const coded = readFileSync(`${dist}/elements/3055/index.html`, 'utf8')
    expect(coded).toContain('UNCL D05B')
    expect(coded).toContain('316 code values')
    expect(coded).toContain('#code-lists-uncl')
    const uncoded = readFileSync(`${dist}/elements/1004/index.html`, 'utf8')
    expect(uncoded).not.toContain('UNCL D05B')
    const docs = readFileSync(`${dist}/docs/alignment-edifact/index.html`, 'utf8')
    expect(docs).toContain('id="code-lists-uncl"')
    expect(docs).toContain('10,104 code values')
  })

  it('serves the JSON-LD context at the stable URL', () => {
    const served = readFileSync(`${dist}/ns/untded-context.jsonld`, 'utf8')
    const source = readFileSync(`data-source/context.jsonld`, 'utf8')
    expect(served).toBe(source)
  })

  it('builds the documentation corpus', () => {
    for (const page of ['index', 'ontology', 'alignment-edifact', 'vocabulary-register', 'provenance', 'context', 'contributing']) {
      const file = page === 'index' ? `${dist}/docs/index.html` : `${dist}/docs/${page}/index.html`
      const html = readFileSync(file, 'utf8')
      expect(html.length, page).toBeGreaterThan(2000)
    }
    const align = readFileSync(`${dist}/docs/alignment-edifact/index.html`, 'utf8')
    expect(align).toContain('representation differs')
    expect(align).toMatch(/id="diff-\d{4}"/)
    expect(readFileSync(`${dist}/index.html`, 'utf8')).toContain('href="/docs"')
  })

  it('carries the UNLK card on the colon-less bridge of element 5010', () => {
    const html = readFileSync(`${dist}/elements/5010/index.html`, 'utf8')
    expect(html).toContain('On the UN layout key')
  })

  it('transcribes the foreword and the cover matter with coverage accounting', () => {
    const foreword = readFileSync(`${dist}/document/foreword/index.html`, 'utf8')
    expect(foreword).toContain('This third edition cancels and replaces the second edition (ISO 7372:1993)')
    expect(foreword).toContain('(ISO6422)')
    expect(foreword).toContain('fully consistent with the set of UN/EDIFACT directories')
    expect(foreword).toContain('François Vuilleumier')

    const index = readFileSync(`${dist}/document/index.html`, 'utf8')
    expect(index).toContain('ECE/TRADE/362')
    expect(index).toContain('New York and Geneva, 2005')
    expect(index).toContain('no ISBN or copyright line is printed')
    expect(index).toContain('Vol. I - Data Elements')
    for (const row of ['PDF pp. 1–2', 'PDF pp. 6–8', 'PDF pp. 9–13', 'PDF p. 19', 'PDF pp. 28–132']) {
      expect(index, row).toContain(row)
    }
  })

  it('completes the introduction and maintenance transcriptions', () => {
    const intro = readFileSync(`${dist}/document/introduction/index.html`, 'utf8')
    for (const def of ['1.3.5', '1.3.6', '1.3.7', '1.3.8']) {
      expect(intro, def).toContain(def)
    }
    expect(intro).toContain('1.3.8 data element')
    expect(intro).toContain('1.8 Availability of the UNTDED and ISO 7372')
    expect(intro).toContain('(1)&nbsp; Available from the International Organization for Standardization')

    const maintenance = readFileSync(`${dist}/document/maintenance/index.html`, 'utf8')
    for (const heading of [
      '2.2 Role of the Maintenance Agency',
      '2.3 Membership',
      '2.3.2 International Organization for Standardization',
      '2.3.3 Associate members',
      '2.4 Rules of procedure',
      '2.4.1 Proposals for changes, additions or deletions',
      '2.4.2 Changes to TDED',
      '2.4.2.1 Change of the name or description',
      '2.4.2.2 Change in the concept',
      '2.4.3 Technical Assessment Checklist (TAC)',
      '2.5 Consultation of members of the MA',
      '2.6 Voting procedures',
      '2.7 Implementation of approved amendments',
    ]) {
      expect(maintenance, heading).toContain(heading)
    }
    expect(maintenance).toContain('UPU')
    expect(maintenance).toContain('Universal Postal Union')
    expect(maintenance).toContain('participate ex officio')
    expect(maintenance).toContain('http://www.iso.org/tc154')
    expect(maintenance).toContain('(cc')
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

  it('wires clipboard copy, shows the change meaning and the 1993 name', () => {
    const html = readFileSync(`${dist}/elements/1128/index.html`, 'utf8')
    expect(html).toContain('__copyWired')
    expect(html).toContain('navigator.clipboard')
    expect(html).toContain('— Changed name + description + representation')
    expect(html).toContain('1993 name:')
    expect(html).toContain('Despatch Note number')
  })

  it('renders bridges with structured line/position semantics', () => {
    const html = readFileSync(`${dist}/elements/1128/index.html`, 'utf8')
    expect(html).toContain('positions 63–80')
    expect(html).toContain('title="UNLK — United Nations Layout Key"')
    const e1188 = readFileSync(`${dist}/elements/1188/index.html`, 'utf8')
    expect(e1188).toContain('Inland Waterways B/L')
  })

  it('carries the publication’s own bridge abbreviations in the glossary', () => {
    const html = readFileSync(`${dist}/notation/index.html`, 'utf8')
    expect(html).toContain('ICS Standard Bill of Lading')
    expect(html).toContain('ISO 3535')
    expect(html).toContain('Aligned Invoices')
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
      [`${dist}/elements/1001/index.html`, 32_000],
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

  it('mounts the search UI with a script valid in inline context', () => {
    // The mount script is emitted inline (data-astro-rerun): a classic
    // script, where top-level await is a SyntaxError and the UI never
    // mounts. The async IIFE is the fix; this is the tripwire.
    const html = readFileSync(`${dist}/search/index.html`, 'utf8')
    expect(html).toContain('PagefindUI')
    expect(html).toMatch(/\(async\s*\(\)\s*=>/)
    for (const f of collectHtml(dist)) {
      const inline = readFileSync(f, 'utf8').match(/<script data-astro-rerun>([\s\S]*?)<\/script>/g) ?? []
      for (const block of inline) {
        // top-level statements sit at script-body indentation (≤ 2 spaces);
        // awaits inside a wrapped function are deeper and fine
        expect(block, f).not.toMatch(/\n {0,2}await\s/)
      }
    }
  })

  it('serves every machine artifact from the download page', () => {
    const html = readFileSync(`${dist}/download/index.html`, 'utf8')
    for (const artifact of [
      '/data/untded.jsonld',
      '/data/untded.ttl',
      '/data/index.json',
      '/data/vocabulary.json',
      '/data/edifact-links.json',
      '/data/uncl-coverage.json',
      '/ns/untded-context.jsonld',
      '/elements/1004/data.ttl',
    ]) {
      expect(html, artifact).toContain(artifact)
      expect(existsSync(`${dist}${artifact}`), `${artifact} not built`).toBe(true)
    }
  })

  it('keeps the per-element context identical to the served context', () => {
    const inline = JSON.parse(readFileSync(`data-source/rdf/1004.jsonld`, 'utf8'))['@context']
    const served = JSON.parse(readFileSync(`data-source/context.jsonld`, 'utf8'))
    const ctx = served['@context'] ?? served
    expect(Object.keys(inline).sort()).toEqual(Object.keys(ctx).sort())
    for (const k of Object.keys(inline)) {
      expect(inline[k], k).toEqual(ctx[k])
    }
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
    expect(html).toContain('img/logo-unece-light.svg')
    expect(html).toContain('img/logo-unece-dark.svg')
    expect(html).toContain('img/logo-iso-light.svg')
    expect(html).toContain('img/logo-iso-dark.svg')
    expect(html).toContain('UNECE — UN/CEFACT')
    expect(html).toContain('ISO/TC 154')
    expect(html).toContain('https://unece.org/untded-iso7372')
    expect(html).toContain('https://www.iso.org/standard/41237.html')
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
