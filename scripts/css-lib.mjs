// Shared CSS build helpers for @cloudensis/*.
//
// Two jobs live here:
//   1. `browserTargets()` - the lightningcss target floor (see 3.2: `@layer`
//      cannot be polyfilled, so browsers without it are out of scope).
//   2. `transformStyleRules()` / `addNotProseGuard()` - the mechanical
//      `.not-prose` exclusion required by 5.3. Writing that clause by hand on
//      every selector guarantees omissions, so the build does it.

import { browserslistToTargets } from 'lightningcss'
import browserslist from 'browserslist'

/**
 * `>= 0.5%, last 2 versions, not dead` as the base, raised to the floor where
 * `@layer` is supported. Anything below that floor would silently drop every
 * rule we ship, so it is cut off rather than degraded.
 */
const LAYER_FLOOR = {
  chrome: 99,
  edge: 99,
  firefox: 97,
  safari: 15.4,
  ios_saf: 15.4,
  opera: 86,
  samsung: 18,
}

export function browserTargets() {
  const queried = browserslist('>= 0.5%, last 2 versions, not dead')
  const floored = []
  for (const entry of queried) {
    const [name, version] = entry.split(' ')
    const floor = LAYER_FLOOR[name]
    if (floor === undefined) continue // browser we do not target at all
    const major = Number.parseFloat(version)
    if (Number.isNaN(major) || major < floor) continue
    floored.push(entry)
  }
  for (const [name, version] of Object.entries(LAYER_FLOOR)) {
    floored.push(`${name} ${version}`)
  }
  return browserslistToTargets(floored)
}

const COMMENT = /\/\*[\s\S]*?\*\//g

const stripComments = (s) => s.replace(COMMENT, '')

/**
 * Walks a flat (un-nested) stylesheet and hands every style-rule prelude to
 * `fn`. At-rule preludes (`@media`, `@layer`, ...) are passed through
 * untouched, but their bodies are still walked.
 */
export function transformStyleRules(css, fn) {
  let out = ''
  let buf = ''
  let i = 0
  while (i < css.length) {
    const c = css[i]
    if (c === '/' && css[i + 1] === '*') {
      const end = css.indexOf('*/', i + 2)
      const j = end === -1 ? css.length : end + 2
      buf += css.slice(i, j)
      i = j
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
      out += stripComments(buf).trim().startsWith('@') ? buf : fn(buf)
      out += '{'
      buf = ''
      i += 1
      continue
    }
    if (c === '}') {
      out += buf + '}'
      buf = ''
      i += 1
      continue
    }
    buf += c
    i += 1
  }
  return out + buf
}

/** Splits on `sep` at nesting depth 0, ignoring (), [] and strings. */
function splitTopLevel(input, sep) {
  const parts = []
  let depth = 0
  let start = 0
  let i = 0
  while (i < input.length) {
    const c = input[i]
    if (c === '"' || c === "'") {
      let j = i + 1
      while (j < input.length) {
        if (input[j] === '\\') j += 2
        else if (input[j] === c) { j += 1; break }
        else j += 1
      }
      i = j
      continue
    }
    if (c === '(' || c === '[') depth += 1
    else if (c === ')' || c === ']') depth -= 1
    else if (c === sep && depth === 0) {
      parts.push(input.slice(start, i))
      start = i + 1
    }
    i += 1
  }
  parts.push(input.slice(start))
  return parts
}

/** Index just past the last top-level combinator, i.e. start of the subject. */
function lastCompoundStart(selector) {
  let depth = 0
  let idx = 0
  let i = 0
  while (i < selector.length) {
    const c = selector[i]
    if (c === '"' || c === "'") {
      let j = i + 1
      while (j < selector.length) {
        if (selector[j] === '\\') j += 2
        else if (selector[j] === c) { j += 1; break }
        else j += 1
      }
      i = j
      continue
    }
    if (c === '(' || c === '[') depth += 1
    else if (c === ')' || c === ']') depth -= 1
    else if (depth === 0 && (c === ' ' || c === '\t' || c === '\n' || c === '>' || c === '+' || c === '~')) {
      idx = i + 1
    }
    i += 1
  }
  return idx
}

/** Index of the pseudo-element (`::x`) inside a compound, or -1. */
function pseudoElementStart(compound) {
  let depth = 0
  for (let i = 0; i < compound.length; i += 1) {
    const c = compound[i]
    if (c === '(' || c === '[') depth += 1
    else if (c === ')' || c === ']') depth -= 1
    else if (depth === 0 && c === ':' && compound[i + 1] === ':') return i
  }
  return -1
}

const GUARDS = {
  full: ':not(:where(.not-prose, .not-prose *))',
  descendants: ':not(:where(.not-prose *))',
  none: '',
}

const DIRECTIVE = /\/\*\s*cds:not-prose=(none|descendants|full)\s*\*\//

/**
 * Appends the `.not-prose` exclusion to the subject compound of every selector
 * that has a combinator. Root selectors (`.prose`, `.prose-lg`, ...) are left
 * alone - they carry no descendant to exclude.
 *
 * A `/* cds:not-prose=descendants *\/` comment in front of a rule narrows the
 * clause to descendants only (5.4 keeps the vertical rhythm on a `.not-prose`
 * element that sits directly in the flow); `=none` opts out entirely.
 */
export function addNotProseGuard(prelude) {
  const directive = DIRECTIVE.exec(prelude)
  const guard = GUARDS[directive ? directive[1] : 'full']
  const cleaned = prelude.replace(new RegExp(DIRECTIVE.source, 'g'), '')
  if (guard === '') return cleaned

  const lead = /^(\s*(?:\/\*[\s\S]*?\*\/\s*)*)/.exec(cleaned)[1]
  const selectorList = cleaned.slice(lead.length)

  const guarded = splitTopLevel(selectorList, ',').map((raw) => {
    const trailing = /\s*$/.exec(raw)[0]
    const selector = raw.slice(0, raw.length - trailing.length)
    const head = /^\s*/.exec(selector)[0]
    const body = selector.slice(head.length)
    if (body === '') return raw
    const start = lastCompoundStart(body)
    if (start === 0) return raw // no combinator: this is the `.prose` root itself
    const compound = body.slice(start)
    const pe = pseudoElementStart(compound)
    const patched =
      pe === -1 ? compound + guard : compound.slice(0, pe) + guard + compound.slice(pe)
    return head + body.slice(0, start) + patched + trailing
  })

  return lead + guarded.join(',')
}

/**
 * Runs `fn` once, then again whenever anything under `watchDirs` changes when
 * invoked with `--watch`. Storybook runs against `dist` (7.6), so the dev loop
 * needs the packages rebuilding in the background.
 */
export async function runBuild(fn, watchDirs = []) {
  const { watch } = await import('node:fs')
  await fn()
  if (!process.argv.includes('--watch')) return

  let queued = null
  const rerun = () => {
    clearTimeout(queued)
    queued = setTimeout(() => {
      fn().catch((error) => console.error(error))
    }, 80)
  }
  for (const dir of watchDirs) {
    watch(dir, { recursive: true }, rerun)
  }
  console.log(`watching ${watchDirs.join(', ')}`)
}

/** The layer order every package that emits CSS must declare (3.2). */
export const LAYER_ORDER = '@layer cds.tokens, cds.prose, cds.ui;'

/**
 * lightningcss rewrites a leading `@layer a, b, c;` statement into whatever it
 * considers equivalent - typically folding the first name into the following
 * block and re-emitting the rest at the bottom of the file. The resulting order
 * is the same, but 3.2 asks for the declaration at the head of every file so
 * that the order holds no matter which stylesheet the app loads first. So the
 * statement is re-pinned here, right after the banner.
 */
export function pinLayerOrder(code) {
  const css = code.toString()
  const banner = /^\s*\/\*![\s\S]*?\*\/\s*/.exec(css)
  const head = banner ? banner[0].trimEnd() : ''
  const body = css.slice(banner ? banner[0].length : 0).replace(/@layer[^;{]*;\s*/g, '')
  return `${head}${head ? '\n' : ''}${LAYER_ORDER}\n${body.trimStart()}`
}
