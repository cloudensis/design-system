import type { Meta, StoryObj } from '@storybook/html-vite'
import { Prose } from '@cloudensis/ui'
import { LongArticle } from '../fixtures/long-article'

// The published artefacts, addressed as files. Loading them into an iframe is
// the only honest way to test "what happens without tokens.css" - custom
// properties inherit through shadow roots, so a shadow DOM would not isolate
// them.
import tokensUrl from '@cloudensis/tokens/tokens.css?url'
import proseUrl from '@cloudensis/prose/prose.css?url'
import uiUrl from '@cloudensis/ui/ui.css?url'

const meta: Meta = {
  title: 'Prose/Isolation',
}
export default meta

const absolute = (url: string) => new URL(url, document.baseURI).href

function frame(stylesheets: string[], bodyHtml: string, height = '78vh') {
  const iframe = document.createElement('iframe')
  iframe.className = 'sb-frame'
  iframe.style.height = height
  iframe.srcdoc = `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${stylesheets.map((href) => `<link rel="stylesheet" href="${absolute(href)}">`).join('\n')}
<style>body { margin: 0; padding: 1.5rem; }</style>
</head>
<body>${bodyHtml}</body>
</html>`
  return iframe
}

const articleHtml = () => String(Prose({ children: LongArticle() }))

function labelled(label: string, element: HTMLElement) {
  const host = document.createElement('div')
  const note = document.createElement('p')
  note.className = 'sb-note'
  note.textContent = label
  host.append(note, element)
  return host
}

/**
 * @cloudensis/prose with no tokens.css loaded at all (3.1).
 *
 * Every token reference in prose carries a literal fallback, so the article has
 * to render completely - not merely "not crash".
 */
export const WithoutTokens: StoryObj = {
  parameters: {
    docs: {
      description: {
        story: [
          '`@cloudensis/tokens` を読み込まずに `prose.css` だけを適用した iframe です。',
          '`prose` は `tokens` を `dependencies` に入れず、CSS変数のフォールバック経由で参照するだけなので、',
          '単体で完全に動くことが要件です（3.1）。',
          '',
          'iframe を使っているのは、CSS カスタムプロパティが shadow root を貫通して継承されるため、',
          'Shadow DOM では隔離にならないからです。',
        ].join('\n'),
      },
    },
  },
  render: () =>
    labelled(
      'prose.css のみ。tokens.css も ui.css も読み込んでいません。',
      frame([proseUrl], articleHtml()),
    ),
}

/**
 * The same three stylesheets in both orders (section 10).
 *
 * Every file declares `@layer cds.tokens, cds.prose, cds.ui;` at its head, so
 * whichever one the app happens to load first fixes the same order.
 */
export const ImportOrderIndependence: StoryObj = {
  parameters: {
    docs: {
      description: {
        story: [
          '同じ3枚の CSS を、宣言された順と逆順で読み込んだ2つの iframe です。表示が変わらないことを確認します。',
          '',
          'CSS を出力する全パッケージがファイル先頭に同一のレイヤ順宣言（`@layer cds.tokens, cds.prose, cds.ui;`）を',
          '置いているため、どれが最初に読まれても順序は同じに固定されます（3.2）。',
        ].join('\n'),
      },
    },
  },
  render: () => {
    const host = document.createElement('div')
    host.append(
      labelled('tokens → prose → ui（README 推奨の順）', frame([tokensUrl, proseUrl, uiUrl], articleHtml(), '48vh')),
      labelled('ui → prose → tokens（逆順）', frame([uiUrl, proseUrl, tokensUrl], articleHtml(), '48vh')),
    )
    return host
  },
}
