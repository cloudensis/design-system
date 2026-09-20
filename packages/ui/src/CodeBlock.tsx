/**
 * Pattern B - does not receive article body.
 *
 * A code block carries structure a stylesheet cannot: the language label, the
 * filename, the copy affordance, and the seam a syntax highlighter plugs into.
 * The root is `not-prose`, so nothing inside is touched by prose (6.5).
 *
 * Highlighting itself is out of scope (section 1). Two seams are provided:
 *
 *   - `html` - drop in markup a highlighter already produced (shiki's `<pre>`,
 *     for instance). It is emitted verbatim.
 *   - otherwise a plain `<pre><code class="language-*">` is rendered, which is
 *     what highlight.js and Prism look for at runtime.
 *
 * The copy button ships as markup only - no client JavaScript is bundled. See
 * the README for the listener to wire up.
 */
import { cn, type ClassValue } from './cn'

export type CodeBlockProps = {
  /** Source text. Ignored when `html` is given. */
  code?: string
  /** Language identifier, e.g. `ts`. Drives the label and `language-*` class. */
  lang?: string
  /** Overrides the visible language label. Defaults to `lang`. */
  label?: string
  filename?: string
  /** Renders the copy button. */
  copy?: boolean
  /** Pre-highlighted markup, emitted as-is in place of the default `<pre>`. */
  html?: string
  class?: ClassValue
}

export const CodeBlock = ({
  code = '',
  lang,
  label,
  filename,
  copy = true,
  html,
  class: className,
}: CodeBlockProps) => {
  const visibleLabel = label ?? lang
  const showHeader = Boolean(filename || visibleLabel || copy)

  return (
    <div class={cn('cds-code-block', 'not-prose', className)} data-cds-lang={lang}>
      {showHeader ? (
        <div class="cds-code-block__header">
          {filename ? <span class="cds-code-block__filename">{filename}</span> : null}
          {visibleLabel ? <span class="cds-code-block__lang">{visibleLabel}</span> : null}
          {copy ? (
            <button
              type="button"
              class="cds-code-block__copy"
              data-cds-copy
              aria-label="コードをコピー"
            >
              コピー
            </button>
          ) : null}
        </div>
      ) : null}

      {html ? (
        <div class="cds-code-block__body" dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <pre class="cds-code-block__pre">
          <code class={cn('cds-code-block__code', lang && `language-${lang}`)}>{code}</code>
        </pre>
      )}
    </div>
  )
}
