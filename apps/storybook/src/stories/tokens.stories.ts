import type { Meta, StoryObj } from '@storybook/html-vite'

/**
 * The token catalogue. Values are read back from the live computed style, so
 * this reflects whatever the Theme toolbar is currently applying rather than a
 * hard-coded copy of the source.
 */
const meta: Meta = {
  title: 'Tokens/Catalogue',
  parameters: {
    docs: {
      description: {
        component: [
          '`@cloudensis/tokens` が `:root` に定義する CSS 変数の一覧です。',
          '値は実際の computed style から読み出しているので、Theme ツールバーの切り替えに追随します。',
          '',
          '**ダークモードの3系統（4.3）**',
          '',
          '1. `prefers-color-scheme: dark`（OS 設定）',
          '2. `class="dark"`',
          '3. `data-theme="dark"`',
          '',
          '手動指定が OS 設定を必ず上書きします。詳細度ではなく記述順で担保しているため、',
          '`.light` / `[data-theme="light"]` のブロックが最後に置かれています。',
          '',
          '**JS から偽装できない確認項目**',
          '',
          '`prefers-color-scheme` は JavaScript から変更できません。',
          'OS 設定由来の分岐の確認は、ブラウザ DevTools のエミュレーション',
          '（Rendering パネルの "Emulate CSS media feature prefers-color-scheme"）で行ってください。',
          'その状態で Theme を `class="light"` にすると、手動指定が OS 設定に勝つことを確認できます。',
        ].join('\n'),
      },
    },
  },
}
export default meta

const GROUPS: Array<[string, string[]]> = [
  ['背景', ['color-bg', 'color-bg-subtle']],
  ['文字', ['color-fg', 'color-fg-muted']],
  ['アクセント・リンク', ['color-accent', 'color-accent-hover']],
  ['罫線', ['color-border', 'color-border-subtle']],
  ['状態色', ['color-success', 'color-warn', 'color-danger', 'color-info']],
  ['コード', ['color-code-fg', 'color-code-bg']],
  ['影', ['shadow-sm', 'shadow-md']],
  ['角丸', ['radius-sm', 'radius-md', 'radius-lg']],
  [
    '余白',
    Array.from({ length: 12 }, (_, i) => `space-${i + 1}`),
  ],
  ['書体', ['font-sans', 'font-mono']],
]

export const Catalogue: StoryObj = {
  render: () => {
    const host = document.createElement('div')
    const computed = getComputedStyle(document.documentElement)

    for (const [title, names] of GROUPS) {
      const heading = document.createElement('h3')
      heading.textContent = title
      heading.style.cssText = 'font-size:0.9rem;margin:1.5rem 0 0.6rem'

      const grid = document.createElement('div')
      grid.className = 'sb-swatches'

      for (const name of names) {
        const value = computed.getPropertyValue(`--cds-${name}`).trim()
        const item = document.createElement('div')
        item.className = 'sb-swatch'

        const chip = document.createElement('i')
        if (name.startsWith('color-')) chip.style.background = `var(--cds-${name})`
        else if (name.startsWith('shadow-')) chip.style.boxShadow = `var(--cds-${name})`
        else if (name.startsWith('radius-')) {
          chip.style.borderRadius = `var(--cds-${name})`
          chip.style.background = 'var(--cds-color-fg-muted)'
        } else if (name.startsWith('space-')) {
          chip.style.width = `var(--cds-${name})`
          chip.style.background = 'var(--cds-color-accent)'
          chip.style.border = '0'
        } else {
          chip.style.border = '0'
          chip.textContent = 'Ag'
          chip.style.fontFamily = `var(--cds-${name})`
        }

        const label = document.createElement('span')
        label.innerHTML = `--cds-${name}<br><span style="opacity:.6">${
          value.length > 46 ? `${value.slice(0, 46)}…` : value
        }</span>`

        item.append(chip, label)
        grid.append(item)
      }

      host.append(heading, grid)
    }

    return host
  },
}
