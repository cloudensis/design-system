#!/usr/bin/env node
/**
 * Mechanical checks for the acceptance criteria in the spec (section 10).
 *
 * These are the invariants that are cheap to state and easy to break by
 * accident, so they run in CI rather than living in a review checklist:
 *
 *   - every selector under `.prose` lands on specificity (0,1,0)
 *   - no `!important` anywhere
 *   - no `@scope` anywhere
 *   - every custom property is namespaced `--cds-`
 *   - nothing outside `.prose` is styled by @cloudensis/prose
 *   - @cloudensis/ui only ever styles `.cds-*`, and emits no Tailwind utilities
 *   - every file opens with the canonical layer-order statement, and every
 *     rule sits inside its package's own layer
 *   - `dist/prose.min.css` stays well under 15 KB
 */

import { readFile, stat } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join, relative } from 'node:path'
import { LAYER_ORDER } from './css-lib.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const problems = []
const fail = (file, message) => problems.push(`${relative(root, file)}: ${message}`)

/* ------------------------------------------------------------------ *
 * A minimal CSS walker. The dist files are machine-generated and flat,
 * so a full parser would be overkill.
 * ------------------------------------------------------------------ */

function walk(css) {
  const rules = []
  const stack = []
  let buf = ''
  let i = 0
  while (i < css.length) {
    const c = css[i]
    if (c === '/' && css[i + 1] === '*') {
      const end = css.indexOf('*/', i + 2)
      i = end === -1 ? css.length : end + 2
      continue
    }
    if (c === '"' || c === "'") {
      let j = i + 1
      while (j < css.length) {
        if (css[j] === '\\') j += 2
        else if (css[j] === c) { j += 1; break }
        else j += 1
      }
      buf += css.slice(i, j)
      i = j
      continue
    }
    if (c === '{') {
      const prelude = buf.trim()
      if (prelude.startsWith('@')) {
        stack.push(prelude)
      } else {
        rules.push({ selector: prelude, context: [...stack] })
        stack.push(null)
      }
      buf = ''
      i += 1
      continue
    }
    if (c === '}') {
      stack.pop()
      buf = ''
      i += 1
      continue
    }
    buf += c
    i += 1
  }
  return rules
}

/** Splits a selector list / compound at nesting depth 0. */
function splitTop(input, sep) {
  const out = []
  let depth = 0
  let start = 0
  for (let i = 0; i < input.length; i += 1) {
    const c = input[i]
    if (c === '(' || c === '[') depth += 1
    else if (c === ')' || c === ']') depth -= 1
    else if (c === sep && depth === 0) {
      out.push(input.slice(start, i))
      start = i + 1
    }
  }
  out.push(input.slice(start))
  return out
}

const ZERO = [0, 0, 0]
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const max = (a, b) => (a[0] * 10000 + a[1] * 100 + a[2] >= b[0] * 10000 + b[1] * 100 + b[2] ? a : b)

/**
 * Specificity of a complex selector, with pseudo-elements excluded.
 *
 * Pseudo-elements are left out on purpose: `::marker` matches a generated box,
 * never an element an author rule could also target, so its (0,0,1) never
 * competes with the element rules the (0,1,0) invariant is about.
 */
function specificity(selector) {
  let spec = ZERO
  let i = 0
  const s = selector
  while (i < s.length) {
    const c = s[i]
    if (c === ':' && s[i + 1] === ':') {
      // pseudo-element: skip it and any argument, contributing nothing
      i += 2
      while (i < s.length && /[\w-]/.test(s[i])) i += 1
      if (s[i] === '(') {
        let depth = 1
        i += 1
        while (i < s.length && depth > 0) {
          if (s[i] === '(') depth += 1
          else if (s[i] === ')') depth -= 1
          i += 1
        }
      }
      continue
    }
    if (c === ':') {
      let j = i + 1
      while (j < s.length && /[\w-]/.test(s[j])) j += 1
      const name = s.slice(i + 1, j).toLowerCase()
      let args = null
      if (s[j] === '(') {
        let depth = 1
        const start = j + 1
        j += 1
        while (j < s.length && depth > 0) {
          if (s[j] === '(') depth += 1
          else if (s[j] === ')') depth -= 1
          j += 1
        }
        args = s.slice(start, j - 1)
      }
      if (name === 'where') {
        // contributes nothing, by definition
      } else if (name === 'is' || name === 'not' || name === 'has' || name === 'matches') {
        let best = ZERO
        for (const arg of splitTop(args ?? '', ',')) best = max(best, specificity(arg))
        spec = add(spec, best)
      } else if (name === 'nth-child' || name === 'nth-last-child') {
        // `:nth-child(n of S)` also takes the max of S; not used here.
        spec = add(spec, [0, 1, 0])
      } else {
        spec = add(spec, [0, 1, 0])
      }
      i = j
      continue
    }
    if (c === '#') {
      i += 1
      while (i < s.length && /[\w-]/.test(s[i])) i += 1
      spec = add(spec, [1, 0, 0])
      continue
    }
    if (c === '.') {
      i += 1
      while (i < s.length && /[\w-]/.test(s[i])) i += 1
      spec = add(spec, [0, 1, 0])
      continue
    }
    if (c === '[') {
      let depth = 1
      i += 1
      while (i < s.length && depth > 0) {
        if (s[i] === '[') depth += 1
        else if (s[i] === ']') depth -= 1
        i += 1
      }
      spec = add(spec, [0, 1, 0])
      continue
    }
    if (/[a-zA-Z]/.test(c)) {
      let j = i
      while (j < s.length && /[\w-]/.test(s[j])) j += 1
      spec = add(spec, [0, 0, 1])
      i = j
      continue
    }
    i += 1
  }
  return spec
}

/** Class names appearing anywhere in a selector. */
function classNames(selector) {
  return [...selector.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)].map((m) => m[1])
}

/* ------------------------------------------------------------------ *
 * Shared checks
 * ------------------------------------------------------------------ */

async function checkCommon(file, css, layer) {
  const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, '')

  if (/!\s*important/i.test(withoutComments)) {
    fail(file, '`!important` is not allowed (5.2)')
  }
  if (/@scope\b/.test(withoutComments)) {
    fail(file, '`@scope` is not allowed - it fails closed on unsupported browsers (5.2.1)')
  }

  const stray = new Set(
    [...withoutComments.matchAll(/--(?!cds-)[\w-]+/g)].map((m) => m[0]),
  )
  if (stray.size > 0) {
    fail(file, `custom properties must be namespaced --cds-*: ${[...stray].join(', ')} (3.4)`)
  }

  const firstAtRule = withoutComments.trim()
  if (!firstAtRule.startsWith(LAYER_ORDER)) {
    fail(file, `must open with \`${LAYER_ORDER}\` (3.2)`)
  }

  for (const rule of walk(withoutComments)) {
    const layers = rule.context.filter((at) => at && at.startsWith('@layer'))
    if (layers.length === 0) {
      fail(file, `rule is not inside a cascade layer: \`${rule.selector}\` (3.2)`)
    } else if (!layers.some((at) => at.includes(layer))) {
      fail(file, `rule is in the wrong layer (expected ${layer}): \`${rule.selector}\``)
    }
  }
}

/* ------------------------------------------------------------------ *
 * @cloudensis/prose
 * ------------------------------------------------------------------ */

async function checkProse() {
  const file = join(root, 'packages/prose/dist/prose.css')
  const css = await readFile(file, 'utf8')
  await checkCommon(file, css, 'cds.prose')

  for (const rule of walk(css.replace(/\/\*[\s\S]*?\*\//g, ''))) {
    for (const raw of splitTop(rule.selector, ',')) {
      const selector = raw.trim()
      if (selector === '') continue

      // 5.5: nothing outside `.prose` may be styled.
      const firstCompound = splitTop(selector, ' ')[0].split('>')[0].trim()
      if (!classNames(firstCompound).some((c) => c === 'prose' || c.startsWith('prose-'))) {
        fail(file, `selector escapes the .prose scope: \`${selector}\` (5.5)`)
      }

      const spec = specificity(selector)
      if (spec.join(',') !== '0,1,0') {
        fail(file, `specificity ${spec.join(',')} !== 0,1,0: \`${selector}\` (5.2)`)
      }
    }
  }

  const min = join(root, 'packages/prose/dist/prose.min.css')
  const { size } = await stat(min)
  const limit = 15 * 1024
  if (size > limit) {
    fail(min, `${(size / 1024).toFixed(1)} KB exceeds the 15 KB budget (section 10)`)
  } else {
    console.log(`  prose.min.css ${(size / 1024).toFixed(1)} KB / 15 KB budget`)
  }
}

/* ------------------------------------------------------------------ *
 * @cloudensis/tokens
 * ------------------------------------------------------------------ */

async function checkTokens() {
  const file = join(root, 'packages/tokens/dist/tokens.css')
  const css = await readFile(file, 'utf8')
  await checkCommon(file, css, 'cds.tokens')

  // 4.3: all three dark-mode routes, and an explicit choice last so it wins.
  const order = ['prefers-color-scheme: dark', '[data-theme="dark"]', '[data-theme="light"]']
  let cursor = -1
  for (const needle of order) {
    const at = css.indexOf(needle, cursor + 1)
    if (at === -1) fail(file, `missing dark-mode route: ${needle} (4.3)`)
    else if (at < cursor) fail(file, `dark-mode blocks are out of order at ${needle} (4.3)`)
    else cursor = at
  }
}

/* ------------------------------------------------------------------ *
 * @cloudensis/ui
 * ------------------------------------------------------------------ */

const UI_ALLOWED_CLASS = /^(cds-|not-prose$|prose$|prose-)/

async function checkUi() {
  const file = join(root, 'packages/ui/dist/ui.css')
  const css = await readFile(file, 'utf8')
  await checkCommon(file, css, 'cds.ui')

  for (const rule of walk(css.replace(/\/\*[\s\S]*?\*\//g, ''))) {
    for (const raw of splitTop(rule.selector, ',')) {
      const selector = raw.trim()
      if (selector === '') continue
      const classes = classNames(selector)
      if (classes.length === 0) {
        fail(file, `selector styles bare elements outside any component: \`${selector}\` (3.6)`)
        continue
      }
      for (const name of classes) {
        if (!UI_ALLOWED_CLASS.test(name)) {
          fail(
            file,
            `class \`.${name}\` is not a cds-* class - @cloudensis/ui must not ` +
              `emit Tailwind utilities or unprefixed classes (3.4 / 3.6 (2)): \`${selector}\``,
          )
        }
      }
    }
  }

  // 3.3: the JavaScript must never import CSS.
  for (const entry of ['index.js', 'utils.js']) {
    const js = await readFile(join(root, 'packages/ui/dist', entry), 'utf8')
    if (/(^|\s)(import|require)\s*\(?\s*["'][^"']+\.css["']/.test(js)) {
      fail(join(root, 'packages/ui/dist', entry), 'JavaScript must not import CSS (3.3)')
    }
  }
}

/* ------------------------------------------------------------------ */

console.log('checking built CSS against the acceptance criteria...')
await checkTokens()
await checkProse()
await checkUi()

if (problems.length > 0) {
  console.error(`\n${problems.length} problem(s):`)
  for (const p of problems) console.error(`  - ${p}`)
  process.exit(1)
}
console.log('all checks passed')
