import type { Meta, StoryObj } from '@storybook/html-vite'
import { Prose } from '@cloudensis/ui'
import { story } from '../render'

const meta: Meta = {
  title: 'UI/Prose',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          '**パターン A — 本文を受け取る。**',
          '',
          '記事の wrapper。クラス名は `@cloudensis/prose/class` の `proseClass()` が組み立てます。',
          '`@cloudensis/ui` が `"prose"` という文字列をハードコードせずに済み、ui → prose の依存が型付きになります（5.9）。',
          '',
          '`class` prop は例外なく受け取り、`cn()` で自分のクラスの後ろに連結します（6.4）。',
          'Tailwind クラスでの上書きは、`cds.ui` より後ろの `utilities` レイヤが勝つことで保証されます。',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'base', 'lg', 'xl'] },
    full: { control: 'boolean' },
    as: { control: 'inline-radio', options: ['article', 'div', 'section'] },
    class: { control: 'text' },
  },
  args: { size: 'base', full: false, as: 'article', class: '' },
}
export default meta

type Args = {
  size: 'sm' | 'base' | 'lg' | 'xl'
  full: boolean
  as: 'article' | 'div' | 'section'
  class: string
}

export const Default: StoryObj<Args> = {
  render: (args) =>
    story(
      Prose({
        ...args,
        class: args.class || undefined,
        children: (
          <>
            <h2>見出し</h2>
            <p>
              本文です。<code>as</code> を変えると出力されるタグが変わります。
            </p>
          </>
        ),
      }),
    ),
}

/**
 * An explicit `prose-*` in `class` wins and the `size`-derived one is dropped,
 * because two size classes in the same layer at the same specificity would
 * leave the outcome to stylesheet order (5.9).
 */
export const ExplicitSizeClassWins: StoryObj<Args> = {
  args: { size: 'sm', class: 'prose-xl' },
  render: (args) => {
    const el = story(
      Prose({
        ...args,
        children: <p>size="sm" と class="prose-xl" を同時に渡しています。</p>,
      }),
    )
    const note = document.createElement('p')
    note.className = 'sb-note'
    note.textContent = `出力された class: "${(el.firstElementChild as HTMLElement)?.className}"`
    const host = document.createElement('div')
    host.append(note, el)
    return host
  },
}
