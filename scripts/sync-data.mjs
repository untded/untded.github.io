// Pulls the machine-readable dataset from the untded-2005 repository
// (the single source of truth) into this repo's committed data-source/.
// Usage: npm run sync-data   [UNTDED_2005_DIR=/path/to/untded-2005]
import { execSync } from 'node:child_process'
import { cpSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const datasetDir = process.env.UNTDED_2005_DIR
  ?? fileURLToPath(new URL('../../untded-2005/', import.meta.url))

execSync('bundle exec bin/export', { cwd: datasetDir, stdio: 'inherit' })

const src = `${datasetDir}/derived/elements.json`
const outDir = fileURLToPath(new URL('../data-source/', import.meta.url))
mkdirSync(outDir, { recursive: true })
cpSync(src, `${outDir}/elements.json`)
console.log(`synced ${src} -> data-source/elements.json`)
