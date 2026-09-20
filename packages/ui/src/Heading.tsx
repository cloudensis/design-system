/**
 * Pattern A - receives article body.
 *
 * A heading is pure typography until it needs an `id`, an anchor and something
 * a table of contents can read back. None of that is expressible in CSS, which
 * is why this is a component and `<p>` is not (6.1).
 *
 * The heading element itself is left in the prose flow; only the anchor - which
 * is decoration - is isolated with `not-prose` (6.5).
 */
import type { Child, PropsWithChildren } from 'hono/jsx'
import { cn, type ClassValue } from './cn'
import { extractText, slugify } from './utils'

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6

export type HeadingProps = {
  level?: HeadingLevel
  /** Explicit id. Falls back to a slug of the heading text. */
  id?: string
  /** Renders the `#` anchor. Requires an id. */
  anchor?: boolean
  /** Label for the anchor link, for screen readers. */
  anchorLabel?: (text: string) => string
  class?: ClassValue
}

const defaultAnchorLabel = (text: string) => `${text} へのリンク`

export const Heading = ({
  level = 2,
  id,
  anchor = true,
  anchorLabel = defaultAnchorLabel,
  class: className,
  children,
}: PropsWithChildren<HeadingProps>) => {
  const text = extractText(children)
  const headingId = id ?? (slugify(text) || undefined)
  const Tag = `h${level}` as 'h1'

  return (
    <Tag
      id={headingId}
      class={cn('cds-heading', className)}
      // Read by table-of-contents builders: the level and the plain-text label
      // are both awkward to recover from the rendered HTML.
      data-cds-heading-level={String(level)}
      data-cds-heading-text={text || undefined}
    >
      {children}
      {anchor && headingId ? (
        <a
          class="cds-heading__anchor not-prose"
          href={`#${headingId}`}
          aria-label={anchorLabel(text)}
        >
          <span aria-hidden="true">#</span>
        </a>
      ) : null}
    </Tag>
  )
}

export type { Child }
