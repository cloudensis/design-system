import type { Meta, StoryObj } from '@storybook/html-vite'
import { Figure, Prose } from '@cloudensis/ui'
import { story } from '../render'

const placeholder = (w: number, h: number, label: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">` +
      `<rect width="${w}" height="${h}" fill="#d4d4d8"/>` +
      `<text x="${w / 2}" y="${h / 2 + 10}" font-family="sans-serif" font-size="28" ` +
      `text-anchor="middle" fill="#52525b">${label}</text></svg>`,
  )}`

const meta: Meta = {
  title: 'UI/Figure',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          '**パターン A — 本文を受け取る（キャプション）。**',
          '',
          'メディア枠には `not-prose` を付け、任意の埋め込みが記事の組版を継承しないようにします。',
          '一方 `figcaption` は prose の流れに残すので、キャプション内の `code` やリンクは本文と同じ見た目になります（6.5）。',
          '',
          '`loading` / `decoding` / アスペクト比 / キャプションの構造を保証するためのコンポーネントです（6.1）。',
          '`ratio` を渡すと読み込み前に領域を確保し、レイアウトシフトを防ぎます。',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    ratio: { control: 'text' },
    loading: { control: 'inline-radio', options: ['lazy', 'eager'] },
  },
  args: { ratio: '16 / 9', loading: 'lazy' },
}
export default meta

type Args = { ratio: string; loading: 'lazy' | 'eager' }

export const Default: StoryObj<Args> = {
  render: (args) =>
    story(
      Prose({
        children: (
          <>
            <p>直前の段落。</p>
            {Figure({
              src: placeholder(640, 360, '640 × 360'),
              alt: 'ダミー画像',
              width: 640,
              height: 360,
              ratio: args.ratio || undefined,
              loading: args.loading,
              caption: (
                <>
                  キャプションには <code>code</code> や{' '}
                  <a href="#figure">リンク</a> を置けます。
                </>
              ),
            })}
            <p>直後の段落。</p>
          </>
        ),
      }),
    ),
}

/** No ratio: the box follows the image's own height. */
export const WithoutRatio: StoryObj<Args> = {
  args: { ratio: '' },
  render: (args) =>
    story(
      Prose({
        children: Figure({
          src: placeholder(480, 200, '480 × 200'),
          alt: 'ダミー画像',
          width: 480,
          height: 200,
          ratio: args.ratio || undefined,
          caption: 'ratio を渡さない場合。',
        }),
      }),
    ),
}

/** Custom media instead of the default `<img>`. */
export const CustomMedia: StoryObj<Args> = {
  render: () =>
    story(
      Prose({
        children: Figure({
          ratio: '21 / 9',
          caption: 'children を渡すと既定の img を差し替えられます。',
          children: (
            <div
              style="display:grid;place-items:center;background:#27272a;color:#e4e4e7;font-family:monospace"
              aria-label="任意の埋め込み"
            >
              任意の埋め込み
            </div>
          ),
        }),
      }),
    ),
}
