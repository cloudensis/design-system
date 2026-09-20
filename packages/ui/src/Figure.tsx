/**
 * Pattern A - receives article body (the caption).
 *
 * Guarantees the `figure` / media / `figcaption` structure, and makes the
 * performance attributes hard to forget: `loading`, `decoding`, and a reserved
 * aspect ratio so the page does not shift while the image loads (6.1).
 *
 * The media box is `not-prose` - an arbitrary embed should not inherit article
 * typography - but the caption is left in the flow, so links and `<code>` in a
 * caption still look like prose (6.5).
 */
import type { Child } from 'hono/jsx'
import { cn, type ClassValue } from './cn'

export type FigureProps = {
  src?: string
  alt?: string
  width?: number | string
  height?: number | string
  srcset?: string
  sizes?: string
  /** Reserved aspect ratio, e.g. `"16 / 9"`. Prevents layout shift. */
  ratio?: string
  loading?: 'lazy' | 'eager'
  decoding?: 'async' | 'sync' | 'auto'
  fetchpriority?: 'high' | 'low' | 'auto'
  caption?: Child
  /** Custom media (a `<video>`, an embed). Replaces the default `<img>`. */
  children?: Child
  class?: ClassValue
}

export const Figure = ({
  src,
  alt = '',
  width,
  height,
  srcset,
  sizes,
  ratio,
  loading = 'lazy',
  decoding = 'async',
  fetchpriority,
  caption,
  children,
  class: className,
}: FigureProps) => (
  <figure class={cn('cds-figure', className)}>
    <div
      class="cds-figure__media not-prose"
      style={ratio ? `aspect-ratio:${ratio}` : undefined}
    >
      {children ?? (
        <img
          class="cds-figure__img"
          src={src}
          alt={alt}
          width={width}
          height={height}
          srcset={srcset}
          sizes={sizes}
          loading={loading}
          decoding={decoding}
          fetchpriority={fetchpriority}
        />
      )}
    </div>
    {caption ? <figcaption class="cds-figure__caption">{caption}</figcaption> : null}
  </figure>
)
