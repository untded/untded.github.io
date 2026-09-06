// Vitest globalSetup: contracts assert against dist/, so the suite must
// never run against a stale build. Rebuild whenever any build input is
// newer than the built output (or dist/ is missing).
import { execSync } from 'node:child_process'
import { existsSync, readdirSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')

function newestMtime(dir, acc = { mtime: 0 }) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist') continue
    const p = join(dir, entry.name)
    if (entry.isDirectory()) newestMtime(p, acc)
    else acc.mtime = Math.max(acc.mtime, statSync(p).mtimeMs)
  }
  return acc.mtime
}

const distIndex = resolve(root, 'dist/index.html')
const inputDirs = ['src', 'scripts', 'data-source', 'public'].map((d) => join(root, d))
const inputFiles = ['astro.config.mjs', 'package.json'].map((f) => join(root, f))

const stale =
  !existsSync(distIndex) ||
  inputDirs.some((d) => newestMtime(d) > statSync(distIndex).mtimeMs) ||
  inputFiles.some((f) => statSync(f).mtimeMs > statSync(distIndex).mtimeMs)

if (stale) {
  console.log('[test setup] build inputs newer than dist/ — rebuilding')
  execSync('npm run build', { cwd: root, stdio: 'inherit' })
}

export default function setup() {}
