// Pulls the machine-readable dataset from the untded-2005 repository
// (the single source of truth) into this repo's committed data-source/.
// Usage: npm run sync-data   [UNTDED_2005_DIR=/path/to/untded-2005]
import { execSync } from 'node:child_process'
import { cpSync, mkdirSync, rmSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const datasetDir = process.env.UNTDED_2005_DIR
  ?? fileURLToPath(new URL('../../untded-2005/', import.meta.url))

execSync('bundle exec bin/export', { cwd: datasetDir, stdio: 'inherit' })

const outDir = fileURLToPath(new URL('../data-source/', import.meta.url))
mkdirSync(outDir, { recursive: true })
cpSync(`${datasetDir}/derived/elements.json`, `${outDir}/elements.json`)
for (const f of ['untded.jsonld', 'untded.ttl']) {
  cpSync(`${datasetDir}/derived/${f}`, `${outDir}/${f}`)
}
const rdfDir = fileURLToPath(new URL('../data-source/rdf/', import.meta.url))
rmSync(rdfDir, { recursive: true, force: true })
cpSync(`${datasetDir}/derived/elements-rdf`, rdfDir, { recursive: true })
// host the source PDFs (ECE/TRADE/362, © UN/UNECE, attribution) on the site
const pdfDir = fileURLToPath(new URL('../public/pdf/', import.meta.url))
mkdirSync(pdfDir, { recursive: true })
for (const pdf of ['UNTDED2005.pdf', 'UNTDED2005_Redacted.pdf']) {
  cpSync(`${datasetDir}/../references/${pdf}`, `${pdfDir}${pdf}`)
}
console.log('synced elements.json, untded.jsonld, untded.ttl, rdf/, pdf/')
