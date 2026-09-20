import type { StorybookConfig } from '@storybook/html-vite'

/**
 * The HTML renderer, not React (7.1).
 *
 * `hono/jsx` is a server-side JSX implementation: a component call produces an
 * HTML string. The HTML renderer's contract - a story returns a string or a DOM
 * node - matches that exactly, so what is catalogued here is the SSR output
 * that actually ships. Putting it on the React renderer would need a shim, and
 * the shim, not the library, would be what gets verified.
 */
const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs'],
  framework: {
    name: '@storybook/html-vite',
    options: {},
  },
  // Holds the Tailwind + Preflight bundle the toolbar toggles (7.4 (2)).
  staticDirs: ['../public'],
  core: { disableTelemetry: true },
}

export default config
