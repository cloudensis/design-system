/**
 * The one JavaScript module in @cloudensis/prose.
 *
 * It exists so that @cloudensis/ui never hard-codes the string `"prose"`: the
 * ui -> prose edge becomes a typed import instead of a convention nobody
 * checks. It has zero dependencies and knows nothing about hono. (5.9)
 */

export type ProseSize = 'sm' | 'base' | 'lg' | 'xl'

export type ProseClassOptions = {
  /** Size modifier. `base` is the default and emits no extra class. */
  size?: ProseSize
  /** Drops the measure cap (`max-width`). */
  full?: boolean
  /** Caller-supplied classes, appended last. */
  class?: string
}

const EXPLICIT_SIZE = /(^|\s)prose-(sm|base|lg|xl)(\s|$)/

/**
 * Builds the class list for a prose container.
 *
 * If the caller already passed a `prose-*` size in `class`, the one derived
 * from `size` is dropped. `prose-lg` and `prose-sm` live in the same layer at
 * the same specificity, so emitting both would leave the outcome to the order
 * the rules happen to appear in the stylesheet - unpredictable from the call
 * site. Cascade layers cannot help here: they arbitrate between layers, not
 * within one. (5.2)
 */
export function proseClass(opts: ProseClassOptions = {}): string {
  const explicit = EXPLICIT_SIZE.test(opts.class ?? '')
  return [
    'prose',
    !explicit && opts.size && opts.size !== 'base' && `prose-${opts.size}`,
    opts.full && 'prose-full',
    opts.class,
  ]
    .filter(Boolean)
    .join(' ')
}
