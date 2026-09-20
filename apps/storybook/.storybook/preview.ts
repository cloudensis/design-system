import type { Preview } from '@storybook/html-vite'

// The canonical consumer stylesheet (7.5), then this app's own chrome and the
// dummy component styles. Everything in host.css is unlayered on purpose.
import '../src/preview.css'
import '../src/host.css'
import '../src/demo-widgets.css'

/**
 * Applies one of the theme routes from 4.3 to <html>.
 *
 * All three manual routes are reachable from the toolbar so the "explicit
 * choice beats the OS" rule can be checked by hand.
 */
function applyTheme(value: string) {
  const root = document.documentElement
  root.classList.remove('light', 'dark')
  root.removeAttribute('data-theme')

  switch (value) {
    case 'class-light':
      root.classList.add('light')
      break
    case 'class-dark':
      root.classList.add('dark')
      break
    case 'attr-light':
      root.setAttribute('data-theme', 'light')
      break
    case 'attr-dark':
      root.setAttribute('data-theme', 'dark')
      break
    default:
      // 'system': no marker at all, so @media (prefers-color-scheme) decides.
      break
  }
}

/** Toggles the prebuilt Tailwind + Preflight bundle (7.4 (2)). */
function applyTailwind(value: string) {
  const link = document.getElementById('cds-tailwind') as HTMLLinkElement | null
  if (link) link.disabled = value !== 'on'
}

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true },
    options: {
      storySort: {
        order: ['Overview', 'Tokens', 'Prose', 'UI'],
      },
    },
    docs: {
      description: {
        component: undefined,
      },
    },
  },

  globalTypes: {
    theme: {
      description: 'Colour-scheme route (4.3)',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        dynamicTitle: true,
        items: [
          { value: 'system', title: 'System (prefers-color-scheme)' },
          { value: 'class-light', title: 'class="light"' },
          { value: 'class-dark', title: 'class="dark"' },
          { value: 'attr-light', title: 'data-theme="light"' },
          { value: 'attr-dark', title: 'data-theme="dark"' },
        ],
      },
    },
    tailwind: {
      description: 'Tailwind CSS + Preflight (3.6 (1))',
      toolbar: {
        title: 'Tailwind',
        icon: 'beaker',
        dynamicTitle: true,
        items: [
          { value: 'off', title: 'Tailwind: off' },
          { value: 'on', title: 'Tailwind: on (Preflight)' },
        ],
      },
    },
  },

  initialGlobals: {
    theme: 'system',
    tailwind: 'off',
  },

  decorators: [
    (storyFn, context) => {
      // Storybook's iframe ships `lang="en"`, which would put every story into
      // prose's Latin range (line-height 1.7, 65ch measure) and hide the
      // Japanese defaults this library is built around (5.8).
      document.documentElement.lang = 'ja'
      applyTheme(String(context.globals.theme ?? 'system'))
      applyTailwind(String(context.globals.tailwind ?? 'off'))
      return storyFn()
    },
  ],
}

export default preview
