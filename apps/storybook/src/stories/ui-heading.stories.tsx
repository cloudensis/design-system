import type { Meta, StoryObj } from '@storybook/html-vite'
import { Heading, Prose } from '@cloudensis/ui'
import { story } from '../render'

const meta: Meta = {
  title: 'UI/Heading',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          '**パターン A — 本文を受け取る。**',
          '',
          '見出しは純粋な組版であるうちは prose の CSS が担当します。コンポーネントに昇格するのは、',
          'CSS では実現できない責務 — `id` の自動付与、アンカー、目次生成のためのデータ — を持つからです（6.1）。',
          '',
          '- `id` を省略すると、見出しテキストから slug を生成します。CJK はそのまま残します（HTML5 で有効なため）。',
          '- `data-cds-heading-level` / `data-cds-heading-text` を出力します。レンダリング後の HTML から',
          '  レベルとプレーンテキストを復元するのは面倒なので、目次ビルダー向けに書き出しています。',
          '- アンカーは装飾なので `not-prose` を付けています。見出し要素自体は prose の流れに残ります（6.5）。',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    level: { control: 'inline-radio', options: [1, 2, 3, 4, 5, 6] },
    anchor: { control: 'boolean' },
    id: { control: 'text' },
  },
  args: { level: 2, anchor: true, id: '' },
}
export default meta

type Args = { level: 1 | 2 | 3 | 4 | 5 | 6; anchor: boolean; id: string }

export const Default: StoryObj<Args> = {
  render: (args) =>
    story(
      Prose({
        children: (
          <>
            {Heading({
              level: args.level,
              anchor: args.anchor,
              id: args.id || undefined,
              children: 'カスケードレイヤという解決策',
            })}
            <p>見出しにカーソルを合わせるとアンカーが現れます。</p>
          </>
        ),
      }),
    ),
}

/** Every level, with the generated ids visible. */
export const AllLevels: StoryObj<Args> = {
  render: () =>
    story(
      Prose({
        children: (
          <>
            {([1, 2, 3, 4, 5, 6] as const).map((level) =>
              Heading({ level, children: `h${level} の見出し — 日本語の slug` }),
            )}
            <p>
              生成される id は NFKC 正規化のうえ、記号と空白を落としたものです。
            </p>
          </>
        ),
      }),
    ),
}
