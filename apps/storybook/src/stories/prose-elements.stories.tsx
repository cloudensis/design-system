import type { Meta, StoryObj } from '@storybook/html-vite'
import { Prose } from '@cloudensis/ui'
import { story, withNote } from '../render'

/**
 * Element groups pulled out of the long article so a regression is easy to
 * localise (7.3).
 */
const meta: Meta = {
  title: 'Prose/Elements',
  parameters: {
    docs: {
      description: {
        component:
          '要素グループごとの検証。長文記事と同じ CSS を、崩れた箇所を特定しやすい単位で表示します。',
      },
    },
  },
}
export default meta

const wrap = (children: unknown, note?: string) => {
  const el = story(Prose({ children: children as never }))
  return note ? withNote(note, el) : el
}

/** Three levels of nesting, and `li` with and without `<p>` (7.3). */
export const Lists: StoryObj = {
  render: () =>
    wrap(
      <>
        <h2>ネストと li の段落</h2>
        <ul>
          <li>単段落の li。</li>
          <li>
            <p>段落を1つ持つ li。上の項目と上下の余白が揃うこと。</p>
          </li>
          <li>
            <p>段落を2つ持つ li。1つ目。</p>
            <p>2つ目。先頭と末尾の余白だけが詰まること。</p>
          </li>
          <li>
            3階層のネスト
            <ul>
              <li>
                第2階層 (circle)
                <ul>
                  <li>第3階層 (square)</li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
        <ol>
          <li>
            decimal
            <ol>
              <li>
                lower-alpha
                <ol>
                  <li>lower-roman</li>
                </ol>
              </li>
            </ol>
          </li>
        </ol>
        <ol type="A">
          <li>type="A" は upper-alpha が勝つこと</li>
          <li>2項目め</li>
        </ol>
      </>,
      'li の余白は、単段落でも複数段落でも同じであること。',
    ),
}

/** A table wider than the measure must scroll itself, not the page (5.7). */
export const WideTable: StoryObj = {
  render: () =>
    wrap(
      <>
        <h2>横幅を超える表</h2>
        <p>表自身が横スクロールし、ページ全体は横に動かないこと。</p>
        <table>
          <caption>幅の広い表</caption>
          <thead>
            <tr>
              {Array.from({ length: 9 }, (_, i) => (
                <th>見出し {i + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 4 }, (_, row) => (
              <tr>
                {Array.from({ length: 9 }, (_, col) => (
                  <td>セル {row + 1}-{col + 1} の内容</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </>,
      '表は display:block + width:max-content で自分自身がスクロールコンテナになります。CSS だけではラッパ要素を足せないためです。',
    ),
}

/** Mixed scripts and an over-long URL (5.8). */
export const Language: StoryObj = {
  render: () =>
    wrap(
      <>
        <h2>日本語・英語の混在と長い URL</h2>
        <p>
          日本語の段落に English words が mixed した状態。行送り 1.8、字間
          0.02em のまま読めること。
        </p>
        <p lang="en">
          A paragraph in English. The <code>:lang(en)</code> range drops back to
          a 1.7 line-height, normal letter-spacing and a 65ch measure, because
          the values tuned for kanji and kana leave Latin text looking loose.
        </p>
        <section lang="en">
          <p>
            <code>lang</code> is inherited through the DOM, so a section-level
            attribute covers its paragraphs without repeating it.
          </p>
        </section>
        <p>
          折り返せない長い URL:
          https://example.com/an/extremely/long/path/segment/that/has/no/spaces/at/all/and/would/otherwise/force/a/horizontal/scrollbar?with=query&amp;more=parameters
        </p>
        <ul>
          <li>
            リストの中の長い URL も同様:
            https://example.com/another/extremely/long/path/segment/without/spaces/anywhere/in/it
          </li>
        </ul>
      </>,
      'overflow-wrap: anywhere を p と li に指定しています。横スクロールバーが出ないこと。',
    ),
}

/** Inline-level elements and the disclosure widget. */
export const Inline: StoryObj = {
  render: () =>
    wrap(
      <>
        <h2>インライン要素</h2>
        <p>
          <strong>strong</strong> / <em>em</em> / <del>del</del> / <s>s</s> /{' '}
          <mark>mark</mark> / <small>small</small> / x<sup>2</sup> / H
          <sub>2</sub>O / <abbr title="Server Side Rendering">SSR</abbr> /{' '}
          <code>code</code> / <kbd>⌘</kbd> / <samp>samp</samp> / <var>var</var>
        </p>
        <blockquote>
          <p>引用。斜体にも引用符付きにもしません。</p>
          <blockquote>
            <p>ネストした引用。</p>
          </blockquote>
        </blockquote>
        <hr />
        <details>
          <summary>閉じた状態の summary</summary>
          <p>開いた中身。</p>
        </details>
        <details open>
          <summary>開いた状態の summary</summary>
          <p>マーカーが disclosure-open に変わること。</p>
        </details>
      </>,
    ),
}
