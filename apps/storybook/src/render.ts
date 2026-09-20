/**
 * The single seam between hono/jsx and Storybook (7.2).
 *
 * Every story goes through here, so nothing in this app depends on how hono
 * turns a component into markup.
 */

type Stringable = { toString(): string | Promise<string> }

/**
 * Renders a hono/jsx node to a detached element.
 *
 * Async, because a hono component may be async - `toString()` then returns a
 * Promise. Used directly by anything that can await.
 */
export async function toDom(node: unknown): Promise<HTMLElement> {
  const el = document.createElement('div')
  el.innerHTML = String(await (node as Stringable).toString())
  return el
}

/**
 * The story-facing wrapper.
 *
 * Storybook's HTML renderer calls `storyFn()` and inspects the result
 * synchronously - it does not await - so a story cannot simply return
 * `toDom(...)`. This hands back a host element immediately and fills it in
 * place: synchronously when the component is synchronous (the common case),
 * and on resolution when it is not.
 */
export function story(node: unknown): HTMLElement {
  const host = document.createElement('div')
  const html = (node as Stringable).toString()
  if (typeof html === 'string') host.innerHTML = html
  else void html.then((resolved) => { host.innerHTML = resolved })
  return host
}

/** Prepends an explanatory note above a story. */
export function withNote(note: string, element: HTMLElement): HTMLElement {
  const host = document.createElement('div')
  const box = document.createElement('p')
  box.className = 'sb-note'
  box.textContent = note
  host.append(box, element)
  return host
}
