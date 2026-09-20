export type ClassValue = string | false | null | undefined

/**
 * Joins class names. That is the whole job.
 *
 * `clsx` and `tailwind-merge` are deliberately absent (6.2 / 6.4):
 *
 * - `clsx` buys object syntax (`{ 'is-active': active }`), which a ternary
 *   covers. @cloudensis/ui keeps `dependencies` empty, so three lines here beat
 *   a package in every consumer's tree.
 * - `tailwind-merge` de-duplicates competing Tailwind utilities. This package
 *   emits none (3.6 (2)), so there is nothing for it to merge. Overrides are
 *   settled by cascade layers instead, which also works when the losing rule is
 *   more specific - something string manipulation can never do.
 *
 * `|| undefined` matters: an empty string makes hono/jsx render `class=""`,
 * while `undefined` drops the attribute entirely.
 */
export const cn = (...inputs: ClassValue[]): string | undefined =>
  inputs.filter(Boolean).join(' ') || undefined
