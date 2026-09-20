#!/usr/bin/env node
/**
 * Refuses to publish from a tag that was cut before the versions were bumped.
 *
 * Releases are triggered by publishing a GitHub Release, so the tag is created
 * by hand and can easily land on a commit that still has unconsumed changesets.
 * `changeset publish` would then find every package already on the registry at
 * its current version, publish nothing, and exit successfully - a release that
 * looks green and shipped nothing.
 */

import { readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const pending = readdirSync(join(root, '.changeset')).filter(
  (name) => name.endsWith('.md') && name.toLowerCase() !== 'readme.md',
)

if (pending.length > 0) {
  console.error(
    `${pending.length} changeset(s) have not been applied:\n` +
      pending.map((name) => `  .changeset/${name}`).join('\n') +
      '\n\nRun `npm run version-packages` on a branch, merge it, and tag that ' +
      'commit instead. The tag currently points at unreleased versions.',
  )
  process.exit(1)
}

for (const name of readdirSync(join(root, 'packages'))) {
  const pkg = JSON.parse(readFileSync(join(root, 'packages', name, 'package.json'), 'utf8'))
  console.log(`${pkg.name}@${pkg.version}`)
}
console.log('\nno pending changesets; versions are the ones that will be published')
