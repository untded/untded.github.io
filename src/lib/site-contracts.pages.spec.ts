// Dist-based page contracts: run after `npm run build` (CI runs vitest
// again post-build). Skips automatically when dist/ is absent so the
// same suite works in validate-only contexts.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import astroConfig from '../../astro.config.mjs'
import { loadElements } from './data'
import { CATEGORY_RANGES } from './element'

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
    for (const c of CATEGORY_RANGES) {
      expect(existsSync(`${dist}/categories/${c.range}/index.html`)).toBe(true)
    }
    for (const p of ['index.html', 'about/index.html', 'notation/index.html', 'method/index.html', 'download/index.html', 'search/index.html', 'elements/index.html', '404.html']) {
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
    expect(jsonld['@graph']).toHaveLength(elements.length + 1)
    expect(readFileSync(`${dist}/data/untded.ttl`, 'utf8')).toMatch(/^@prefix .*utd: <https:\/\/www\.untded\.org\/ns\/untded#>/m)
    const elementHtml = readFileSync(`${dist}/elements/1001/index.html`, 'utf8')
    expect(elementHtml).toContain('application/ld+json')
    expect(elementHtml).toContain('TradeDataElement')
    expect(readFileSync(`${dist}/index.html`, 'utf8')).toContain('application/ld+json')
  })

  it('lists all elements in the no-JS directory table', () => {
    const html = readFileSync(`${dist}/elements/index.html`, 'utf8')
    const rows = html.match(/<tr\b/g)?.length ?? 0
    expect(rows).toBeGreaterThanOrEqual(elements.length)
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
    ]
    for (const [p, max] of budgets) {
      expect(statSync(p).size, `${p} over budget`).toBeLessThan(max)
    }
  })

  it('indexes the site for full-text search', () => {
    const entries = readdirSync(`${dist}/pagefind`)
    expect(entries).toContain('pagefind-entry.json')
  })

  it('brands every page UN/TDED and never the old wordmark', () => {
    const pages = ['index.html', 'about/index.html', 'elements/1001/index.html', '404.html']
    for (const p of pages) {
      const html = readFileSync(`${dist}/${p}`, 'utf8')
      expect(html).toContain('wordmark-slash')
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
  // fails on any recurrence of that bug class.
  it('renders no collapsed text/element boundaries', () => {
    const files = collectHtml(dist)
    const broken: string[] = []
    const re = /<\/(a|kbd|strong|em|code)>(?=[A-Za-z])|(?<=[a-z…,)”])<(a|kbd|strong|em|code)[\s>]/
    for (const f of files) {
      const html = readFileSync(f, 'utf8')
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
