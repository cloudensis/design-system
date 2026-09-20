/**
 * Pattern A - receives article body.
 *
 * The wrapper every article is rendered into. The class list comes from
 * `@cloudensis/prose/class` rather than a literal `"prose"` so the two
 * packages stay in step (5.9).
 */
import type { PropsWithChildren } from 'hono/jsx'
import { proseClass, type ProseSize } from '@cloudensis/prose/class'
import { type ClassValue } from './cn'

export type { ProseSize }

export type ProseProps = {
  /** Size modifier. `base` is the default and adds no class. */
  size?: ProseSize
  /** Drops the measure cap so the article fills its container. */
  full?: boolean
  class?: ClassValue
  as?: 'article' | 'div' | 'section'
}

export const Prose = ({
  size,
  full,
  class: className,
  as: Tag = 'article',
  children,
}: PropsWithChildren<ProseProps>) => (
  <Tag class={proseClass({ size, full, class: className || undefined })}>{children}</Tag>
)
