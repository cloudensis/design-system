#!/usr/bin/env node
/**
 * Prints the tarball contents of every publishable package, and fails if
 * anything outside `dist/` (plus the three files npm always includes) would
 * ship.
 *
 * The npm registry is immutable: a name/version pair can never be reused, even
 * after an unpublish. So the file list is something to read before publishing,
 * not after - which is why CI prints it into the log (section 8).
 */

import { execFileSync } from 'node:child_process'
import { readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const packagesDir = join(root, 'packages')

const ALWAYS_INCLUDED = new Set(['package.json', 'README.md', 'LICENSE'])
const problems = []

for (const name of readdirSync(packagesDir)) {
  const dir = join(packagesDir, name)
  const pkg = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'))

  const raw = execFileSync('npm', ['pack', '--dry-run', '--json'], {
    cwd: dir,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit'],
  })
  const [report] = JSON.parse(raw)

  console.log(`\n${pkg.name}@${pkg.version}  (${report.files.length} files, ${(report.unpackedSize / 1024).toFixed(1)} KB unpacked)`)
  for (const file of report.files) {
    console.log(`  ${file.path.padEnd(48)} ${String(file.size).padStart(8)} B`)
    if (!file.path.startsWith('dist/') && !ALWAYS_INCLUDED.has(file.path)) {
      problems.push(`${pkg.name}: unexpected file in tarball: ${file.path}`)
    }
  }

  for (const required of ALWAYS_INCLUDED) {
    if (!report.files.some((f) => f.path === required)) {
      problems.push(`${pkg.name}: tarball is missing ${required}`)
    }
  }
}

if (problems.length > 0) {
  console.error(`\n${problems.length} problem(s):`)
  for (const p of problems) console.error(`  - ${p}`)
  process.exit(1)
}
console.log('\nevery tarball contains dist/ plus package.json, README.md and LICENSE only')
