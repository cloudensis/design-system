/**
 * Stand-in components for the interference stories (7.3).
 *
 * They are NOT part of @cloudensis/ui and must never move there - the spec
 * reserves that package for the four components in 6.1 plus the conventions,
 * and leaves the rest to be written later. These exist only to prove that a
 * `cds-*` component and `.prose` do not fight, in both of the shapes described
 * in 6.5.
 *
 * They follow the same rules a real component must:
 *   - a `class` prop, appended after the component's own classes (6.4)
 *   - `cds-` prefixed BEM classes, never Tailwind utilities (3.6 (2))
 *   - styles in the `cds.ui` layer (src/demo-widgets.css)
 */
import type { Child, PropsWithChildren } from 'hono/jsx'
import { cn } from '@cloudensis/ui'

type Tone = 'info' | 'warn' | 'danger' | 'success'

const TONE_MARK: Record<Tone, string> = {
  info: 'i',
  warn: '!',
  danger: '×',
  success: '✓',
}

/**
 * Pattern A - receives article body.
 *
 * `not-prose` is on the icon only. Putting it on the root would drag the
 * caller's paragraphs out of prose as well, which is the mistake 6.5 warns
 * against.
 */
export const DemoCallout = ({
  tone = 'info',
  class: className,
  children,
}: PropsWithChildren<{ tone?: Tone; class?: string }>) => (
  <aside class={cn('cds-demo-callout', `cds-demo-callout--${tone}`, className)}>
    <div class="cds-demo-callout__icon not-prose" aria-hidden="true">
      {TONE_MARK[tone]}
    </div>
    <div class="cds-demo-callout__body">{children}</div>
  </aside>
)

/**
 * Pattern B - does not receive article body.
 *
 * The root is `not-prose`, so the whole subtree is isolated.
 */
export const DemoButton = ({
  href,
  class: className,
  children,
}: PropsWithChildren<{ href: string; class?: string }>) => (
  <a href={href} class={cn('cds-demo-button', 'not-prose', className)}>
    {children}
  </a>
)

export type { Child }
