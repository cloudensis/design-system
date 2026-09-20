import type { Meta, StoryObj } from '@storybook/html-vite'
import { CodeBlock, Prose } from '@cloudensis/ui'
import { story, withNote } from '../render'

const SAMPLE = `export const cn = (...inputs: ClassValue[]): string | undefined =>
  inputs.filter(Boolean).join(' ') || undefined
`

const meta: Meta = {
  title: 'UI/CodeBlock',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          '**パターン B — 本文を受け取らない。** 根に `not-prose` を付けて丸ごと隔離します（6.5）。',
          '',
          '言語ラベル、ファイル名、コピーボタン、そしてハイライタとの接続点を持つため、',
          'CSS では実現できません（6.1）。',
          '',
          '**シンタックスハイライトは範囲外です（1章）。** 接続点は2つあります。',
          '',
          '1. `html` prop — shiki などが生成済みの markup をそのまま出力します。',
          '2. 省略時は `<pre><code class="language-*">` を出力します。highlight.js / Prism が実行時に探す形です。',
          '',
          'どちらの場合も、`pre` の配下には色を一切指定していません。',
          'shiki はインラインスタイルを書き、highlight.js はレイヤ外の CSS を配るので、両方ともこちらに勝ちます。',
          '',
          '**コピーボタンに JavaScript は同梱していません**（`hono/jsx/dom` 向けの実装は非目的）。',
          'markup だけを出力し、`data-cds-copy` を目印にしています。リスナは README のスニペットを参照してください。',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    lang: { control: 'text' },
    filename: { control: 'text' },
    copy: { control: 'boolean' },
  },
  args: { lang: 'ts', filename: 'packages/ui/src/cn.ts', copy: true },
}
export default meta

type Args = { lang: string; filename: string; copy: boolean }

export const Default: StoryObj<Args> = {
  render: (args) =>
    story(
      Prose({
        children: (
          <>
            <p>直前の段落。</p>
            {CodeBlock({ code: SAMPLE, ...args })}
            <p>直後の段落。</p>
          </>
        ),
      }),
    ),
}

/** Markup produced by a highlighter, passed straight through. */
export const PreHighlighted: StoryObj<Args> = {
  render: (args) =>
    withNote(
      'html prop に渡した markup はそのまま出力されます。ここではインラインスタイルでハイライタを模しています。',
      story(
        Prose({
          children: CodeBlock({
            ...args,
            filename: 'highlighted.ts',
            html:
              '<pre style="background-color:#1e1e2e;color:#cdd6f4;margin:0;padding:1rem;overflow-x:auto">' +
              '<code><span style="color:#cba6f7">export const</span> ' +
              '<span style="color:#89b4fa">cn</span> = (' +
              '<span style="color:#fab387">...inputs</span>) =&gt; …</code></pre>',
          }),
        }),
      ),
    ),
}

/** No header at all. */
export const Bare: StoryObj<Args> = {
  args: { lang: '', filename: '', copy: false },
  render: (args) =>
    story(Prose({ children: CodeBlock({ code: SAMPLE, ...args, lang: args.lang || undefined }) })),
}
