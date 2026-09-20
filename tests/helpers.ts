/** Renders a hono/jsx node the way a Hono handler would. */
export async function render(node: unknown): Promise<string> {
  return String(await (node as { toString(): string | Promise<string> }).toString())
}
