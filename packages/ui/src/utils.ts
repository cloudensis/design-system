/**
 * Optional helpers (6.7). Server-side only - nothing here touches the DOM.
 */

/**
 * Flattens a JSX tree to plain text: OGP descriptions, RSS summaries, search
 * indexes, and the slug `Heading` derives when no `id` is given.
 *
 * Limitation worth knowing: a function component is not invoked, so this reads
 * the children passed *to* it, not what it renders. For `<Callout><p>text</p>
 * </Callout>` that is the same thing; for a component that generates its own
 * copy it is not.
 */
export function extractText(node: unknown): string {
  if (node === null || node === undefined || typeof node === 'boolean') return ''
  if (typeof node === 'string') return node
  if (typeof node === 'number' || typeof node === 'bigint') return String(node)
  if (Array.isArray(node)) return node.map(extractText).join('')
  if (typeof node === 'object') {
    const candidate = node as { children?: unknown; props?: { children?: unknown } }
    if (candidate.children !== undefined) return extractText(candidate.children)
    if (candidate.props?.children !== undefined) return extractText(candidate.props.children)
  }
  return ''
}

/**
 * Builds a URL fragment from heading text.
 *
 * CJK code points are kept rather than transliterated: HTML5 allows them in
 * `id`, browsers resolve them, and a romanised guess would be worse than the
 * original. Punctuation and spaces go.
 */
export function slugify(input: string): string {
  return input
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[\s　]+/g, '-')
    .replace(/[^\p{Letter}\p{Number}\p{Mark}_-]+/gu, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
}
