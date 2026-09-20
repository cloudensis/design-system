import type { Meta, StoryObj } from '@storybook/html-vite'
import { Prose } from '@cloudensis/ui'
import { story, withNote } from '../render'
import { LongArticle } from '../fixtures/long-article'

/**
 * The full article, every supported element in one place (7.3).
 *
 * Use the Theme and Tailwind toolbars to check 3.6 (1) and 4.3 against the
 * same content.
 */
const meta: Meta = {
  title: 'Prose/Article',
  parameters: {
    docs: {
      description: {
        component: [
          '5.7 の全要素を1本に含めた長文記事。fixture は `src/fixtures/long-article.tsx` にあり、',
          '複数の story から再利用しています。',
          '',
          '**ツールバー**',
          '',
          '- Theme: `light` / `dark` / `data-theme` / `class` の各系統を切り替えます。',
          '- Tailwind: Preflight 込みの Tailwind を有効・無効にします。両方で同じ見た目になることが要件です（3.6 (1)）。',
          '',
          '**JS からは偽装できない確認項目**',
          '',
          '`prefers-color-scheme` は JavaScript から変更できません。',
          '4.3 の2番目のブロック（OS がダーク、かつ明示指定なし）と、',
          '「手動指定が OS 設定を上書きする」ことの確認は、',
          'ブラウザ DevTools のエミュレーション機能で OS 設定をダークにしたうえで、',
          'Theme ツールバーを `System` → `class="light"` と切り替えて行ってください。',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['sm', 'base', 'lg', 'xl'],
      description: 'サイズモディファイア。`.prose` 自身の font-size だけが変わり、配下は em で追随します（5.6）',
    },
    full: {
      control: 'boolean',
      description: '`max-width: none`。既定は `var(--cds-prose-measure)` = 40em',
    },
  },
  args: { size: 'base', full: false },
}
export default meta

type Args = { size: 'sm' | 'base' | 'lg' | 'xl'; full: boolean }

export const Default: StoryObj<Args> = {
  render: (args) => story(Prose({ ...args, children: LongArticle() })),
}

/** All four sizes at once, so the steps can be compared directly (5.7). */
export const Sizes: StoryObj<Args> = {
  argTypes: { size: { table: { disable: true } } },
  render: (args) => {
    const host = document.createElement('div')
    for (const size of ['sm', 'base', 'lg', 'xl'] as const) {
      const label = document.createElement('p')
      label.className = 'sb-note'
      label.textContent = `.prose.prose-${size}`
      host.append(
        label,
        story(
          Prose({
            size,
            full: args.full,
            children: LongArticle(),
          }),
        ),
      )
    }
    return host
  },
}

/** `.prose-full` removes the measure cap. */
export const Full: StoryObj<Args> = {
  args: { full: true },
  render: (args) =>
    withNote(
      '.prose-full: max-width が none になります。既定の 40em は日本語の本文向けの値です。',
      story(Prose({ ...args, children: LongArticle() })),
    ),
}
