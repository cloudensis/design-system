/**
 * Import smoke tests for the BUILT packages (7.8).
 *
 * Storybook verifies the rendered output; it does not verify that a Hono app
 * can actually resolve these packages - ESM-only resolution, the `exports` map,
 * the peer dependency, and the rule that JavaScript never imports CSS. That is
 * what these cover.
 *
 * Everything here imports through the package name, so it goes through
 * `exports` exactly as a consumer would. `publint` covers the rest of the
 * manifest in CI.
 */
import { describe, expect, it } from 'vitest'
import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'

import { CodeBlock, Figure, Heading, Prose, cn } from '@cloudensis/ui'
import { extractText, slugify } from '@cloudensis/ui/utils'
import { proseClass } from '@cloudensis/prose/class'
import { render } from './helpers'

const require = createRequire(import.meta.url)
const readPkg = (name: string) =>
  JSON.parse(readFileSync(require.resolve(`${name}/package.json`), 'utf8'))

describe('package manifests', () => {
  it('@cloudensis/ui has no runtime dependencies and keeps hono as a peer', () => {
    const pkg = readPkg('@cloudensis/ui')
    expect(pkg.dependencies ?? {}).toEqual({})
    expect(pkg.peerDependencies).toEqual({ hono: '^4' })
    // 6.2 / 0: explicitly not adopted.
    const all = { ...pkg.dependencies, ...pkg.peerDependencies }
    expect(Object.keys(all)).not.toContain('clsx')
    expect(Object.keys(all)).not.toContain('tailwind-merge')
    expect(Object.keys(all)).not.toContain('tailwindcss')
  })

  it('every package is public, MIT and ships only dist', () => {
    for (const name of ['@cloudensis/tokens', '@cloudensis/prose', '@cloudensis/ui']) {
      const pkg = readPkg(name)
      expect(pkg.license, name).toBe('MIT')
      expect(pkg.publishConfig?.access, name).toBe('public')
      expect(pkg.private, name).toBeUndefined()
      expect(pkg.files, name).toEqual(['dist'])
      expect(pkg.dependencies ?? {}, name).toEqual({})
    }
  })

  it('CSS is reachable through explicit subpaths, never imported from JS', () => {
    // 3.3: bundlers and Workers builds disagree about CSS imports inside JS,
    // so the app collects the stylesheets itself.
    expect(require.resolve('@cloudensis/tokens/tokens.css')).toMatch(/dist[/\\]tokens\.css$/)
    expect(require.resolve('@cloudensis/prose/prose.css')).toMatch(/dist[/\\]prose\.css$/)
    expect(require.resolve('@cloudensis/ui/ui.css')).toMatch(/dist[/\\]ui\.css$/)

    const js = readFileSync(require.resolve('@cloudensis/ui'), 'utf8')
    expect(js).not.toMatch(/["'][^"']+\.css["']/)
  })

  it('ships ESM only', () => {
    for (const name of ['@cloudensis/prose', '@cloudensis/ui']) {
      const pkg = readPkg(name)
      expect(pkg.type, name).toBe('module')
      expect(pkg.main, name).toBeUndefined()
    }
  })
})

describe('Prose', () => {
  it('renders an article with the prose class', async () => {
    expect(await render(Prose({ children: 'ほんぶん' }))).toBe(
      '<article class="prose">ほんぶん</article>',
    )
  })

  it('applies size, full and caller classes in that order', async () => {
    const html = await render(
      Prose({ size: 'lg', full: true, class: 'mx-auto', as: 'section', children: 'x' }),
    )
    expect(html).toBe('<section class="prose prose-lg prose-full mx-auto">x</section>')
  })

  it('drops the derived size when the caller passes an explicit prose-* class', () => {
    // Two size classes in one layer at one specificity would be resolved by
    // stylesheet order, which the call site cannot see (5.9).
    expect(proseClass({ size: 'sm', class: 'prose-xl' })).toBe('prose prose-xl')
    expect(proseClass({ size: 'lg' })).toBe('prose prose-lg')
    expect(proseClass({ size: 'base' })).toBe('prose')
    expect(proseClass()).toBe('prose')
  })
})

describe('Heading', () => {
  it('derives an id, emits table-of-contents data and an isolated anchor', async () => {
    const html = await render(Heading({ level: 2, children: 'カスケードレイヤ' }))
    expect(html).toContain('<h2')
    expect(html).toContain('id="カスケードレイヤ"')
    expect(html).toContain('data-cds-heading-level="2"')
    expect(html).toContain('data-cds-heading-text="カスケードレイヤ"')
    // Decoration only: the heading itself stays in the prose flow (6.5).
    expect(html).toContain('class="cds-heading__anchor not-prose"')
  })

  it('honours an explicit id and can drop the anchor', async () => {
    const html = await render(Heading({ level: 3, id: 'custom', anchor: false, children: 'x' }))
    expect(html).toBe(
      '<h3 id="custom" class="cds-heading" data-cds-heading-level="3" data-cds-heading-text="x">x</h3>',
    )
  })
})

describe('CodeBlock', () => {
  it('isolates itself with not-prose and escapes the source', async () => {
    const html = await render(CodeBlock({ code: '<script>alert(1)</script>', lang: 'ts' }))
    expect(html).toContain('class="cds-code-block not-prose"')
    expect(html).toContain('language-ts')
    expect(html).toContain('&lt;script&gt;')
    expect(html).not.toContain('<script>')
  })

  it('passes pre-highlighted markup through untouched', async () => {
    const html = await render(CodeBlock({ html: '<pre class="shiki"><code>x</code></pre>' }))
    expect(html).toContain('<pre class="shiki"><code>x</code></pre>')
  })

  it('omits the header when there is nothing to put in it', async () => {
    const html = await render(CodeBlock({ code: 'x', copy: false }))
    expect(html).not.toContain('cds-code-block__header')
  })
})

describe('Figure', () => {
  it('sets the performance attributes and reserves the ratio', async () => {
    const html = await render(
      Figure({ src: '/a.png', alt: 'a', width: 640, height: 360, ratio: '16 / 9', caption: 'cap' }),
    )
    expect(html).toContain('loading="lazy"')
    expect(html).toContain('decoding="async"')
    expect(html).toContain('width="640"')
    expect(html).toContain('aspect-ratio:16 / 9')
    // Media isolated, caption left in the prose flow (6.5).
    expect(html).toContain('class="cds-figure__media not-prose"')
    expect(html).toContain('<figcaption class="cds-figure__caption">cap</figcaption>')
  })

  it('omits the figcaption when there is no caption', async () => {
    const html = await render(Figure({ src: '/a.png', alt: 'a' }))
    expect(html).not.toContain('figcaption')
  })
})

describe('every component accepts a class prop (6.4)', () => {
  it.each([
    ['Prose', () => Prose({ class: 'px-8', children: 'x' })],
    ['Heading', () => Heading({ class: 'px-8', children: 'x' })],
    ['CodeBlock', () => CodeBlock({ class: 'px-8', code: 'x' })],
    ['Figure', () => Figure({ class: 'px-8', src: '/a.png' })],
  ])('%s appends it after its own classes', async (_name, build) => {
    const html = await render(build())
    expect(html).toMatch(/class="[^"]*\bpx-8"/)
  })
})

describe('cn', () => {
  it('drops falsy values', () => {
    expect(cn('a', false, null, undefined, 'b')).toBe('a b')
  })

  it('returns undefined rather than an empty string', () => {
    // An empty string makes hono/jsx render `class=""`.
    expect(cn(false, undefined)).toBeUndefined()
  })
})

describe('utils', () => {
  it('extracts text through nested nodes', () => {
    const node = Prose({
      children: [
        Heading({ level: 2, anchor: false, children: '見出し' }),
        ' と ',
        42,
      ],
    })
    expect(extractText(node)).toContain('見出し')
    expect(extractText(node)).toContain('42')
  })

  it('slugifies Japanese and Latin headings', () => {
    expect(slugify('カスケードレイヤという解決策')).toBe('カスケードレイヤという解決策')
    expect(slugify('  Hello, World!  ')).toBe('-hello-world-'.replace(/^-|-$/g, ''))
    expect(slugify('a  b')).toBe('a-b')
    expect(slugify('!!!')).toBe('')
  })
})
