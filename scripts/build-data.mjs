// Transforms data-source/elements.json into the runtime payloads under
// public/data/ (gitignored, regenerated on every dev/build run):
//   index.json — the compact directory index (filter island + omnibox)
//   meta.json  — categories, counts, stats (build-time + footer)
import { copyFileSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { toIndexRows } from './lib/build-index.mjs'
import { buildMeta } from './lib/meta.mjs'

const source = JSON.parse(
  readFileSync(fileURLToPath(new URL('../data-source/elements.json', import.meta.url)), 'utf8'),
)
const rows = toIndexRows(source.elements)
const meta = buildMeta(source.elements)

const outDir = fileURLToPath(new URL('../public/data/', import.meta.url))
mkdirSync(outDir, { recursive: true })
writeFileSync(`${outDir}/index.json`, JSON.stringify(rows))
writeFileSync(`${outDir}/meta.json`, JSON.stringify(meta))
for (const f of ['untded.jsonld', 'untded.ttl']) {
  copyFileSync(
    fileURLToPath(new URL(`../data-source/${f}`, import.meta.url)),
    `${outDir}/${f}`,
  )
}
// dereferenceable per-element RDF: data-source/rdf/<tag>.{jsonld,ttl}
// is served at /elements/<tag>/data.{jsonld,ttl}
const rdfDir = fileURLToPath(new URL('../data-source/rdf/', import.meta.url))
for (const file of readdirSync(rdfDir)) {
  const m = file.match(/^(\d{4})\.(jsonld|ttl)$/)
  if (!m) continue
  const tagDir = fileURLToPath(new URL(`../public/elements/${m[1]}/`, import.meta.url))
  mkdirSync(tagDir, { recursive: true })
  copyFileSync(`${rdfDir}/${file}`, `${tagDir}/data.${m[2]}`)
}
console.log(`build-data: ${rows.length} index rows, ${meta.categories.length} categories, linked data -> public/data/`)
