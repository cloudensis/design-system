/**
 * One article containing every element @cloudensis/prose supports (5.7).
 *
 * Written the way a consuming repository writes an article: JSX, with UI
 * components sitting directly in the flow. It is reused from several stories,
 * so a regression in any element shows up everywhere at once.
 */
import { CodeBlock, Figure, Heading } from '@cloudensis/ui'
import { DemoButton, DemoCallout } from '../components/demo-widgets'

const SAMPLE_TS = `import { Hono } from 'hono'
import { Prose } from '@cloudensis/ui'

const app = new Hono()

app.get('/articles/:slug', (c) => c.html(
  <Prose size="lg">
    <h1>記事のタイトル</h1>
    <p>本文。</p>
  </Prose>,
))

export default app
`

export const LongArticle = () => (
  <>
    <h1>カスケードレイヤで組み立てる記事のためのデザインシステム</h1>

    <p class="lead">
      この段落は <code>.lead</code> です。導入文として本文よりわずかに大きく、
      やや淡い色で表示されます。
    </p>

    <p>
      本文の標準的な段落です。日本語の本文を既定としているため、行送りは 1.8、
      字間は 0.02em、そして一行の長さは 40em に制限されています。
      欧文向けの 65ch をそのまま使うと、全角では一行が 65 文字相当になり、
      視線の戻りが極端に長くなってしまいます。
    </p>

    <p>
      強調は <strong>strong で太字</strong>、<em>em で斜体</em>、
      取り消しは <del>del</del> と <s>s</s>、ハイライトは <mark>mark</mark>、
      注釈は <small>small</small> です。化学式は H<sub>2</sub>O、
      冪は x<sup>2</sup>、略語は{' '}
      <abbr title="Cascading Style Sheets">CSS</abbr> のように書けます。
    </p>

    <Heading level={2} id="headings">
      見出し
    </Heading>

    <p>
      <code>h1</code> から <code>h6</code> まですべてに規則があります。
      <code>h5</code> と <code>h6</code> を省略すると、深い階層の文書で
      いきなり素のブラウザ既定に落ちます。
    </p>

    <h3>h3 見出し — 節の中の区切り</h3>
    <p>h3 の直後の段落です。</p>
    <h4>h4 見出し</h4>
    <p>h4 の直後の段落です。</p>
    <h5>h5 見出し</h5>
    <p>h5 の直後の段落です。</p>
    <h6>h6 見出し</h6>
    <p>h6 の直後の段落です。</p>

    <DemoCallout tone="warn">
      <p>
        これはパターン A のコンポーネントです。この中の段落にも{' '}
        <code>.prose</code> が効いていること、そして
        <a href="#headings">リンク</a>も記事本文と同じ見た目になることを
        確認してください。
      </p>
      <p>2つ目の段落です。段落間の余白も本文と揃います。</p>
    </DemoCallout>

    <Heading level={2} id="lists">
      リスト
    </Heading>

    <ul>
      <li>第1階層の項目。マーカーは disc。</li>
      <li>
        ネストした階層
        <ul>
          <li>
            第2階層。マーカーは circle。
            <ul>
              <li>第3階層。マーカーは square。</li>
              <li>3階層までは必ず検証します。</li>
            </ul>
          </li>
        </ul>
      </li>
      <li>
        <p>これは複数段落の li です。1つ目の段落。</p>
        <p>2つ目の段落。単段落の li と上下の余白が揃っていること。</p>
      </li>
    </ul>

    <ol>
      <li>番号付きリストの第1項。</li>
      <li>
        ネスト
        <ol>
          <li>
            第2階層は lower-alpha。
            <ol>
              <li>第3階層は lower-roman。</li>
            </ol>
          </li>
        </ol>
      </li>
      <li>第3項。</li>
    </ol>

    <dl>
      <dt>カスケードレイヤ</dt>
      <dd>
        詳細度より先に判定される優先順位の仕組み。レイヤ外の CSS はすべての
        レイヤより強くなります。
      </dd>
      <dt>デザイントークン</dt>
      <dd>CSS カスタムプロパティとして配布される、色・余白・書体の定義。</dd>
    </dl>

    <Heading level={2} id="quotes">
      引用と区切り
    </Heading>

    <blockquote>
      <p>引用文です。日本語では斜体にせず、引用符も自動挿入しません。</p>
      <blockquote>
        <p>ネストした引用。罫線が二重になります。</p>
      </blockquote>
    </blockquote>

    <hr />

    <Heading level={2} id="code">
      コード
    </Heading>

    <p>
      インラインの <code>const x = 1</code> と、<kbd>Ctrl</kbd> +{' '}
      <kbd>C</kbd> のようなキー表記、出力の <samp>Build complete</samp>、
      変数の <var>n</var> を区別します。
    </p>

    <pre>
      <code>{`// 素の pre > code。ハイライトは消費側の責務。
function add(a: number, b: number) {
  return a + b
}`}</code>
    </pre>

    <CodeBlock code={SAMPLE_TS} lang="tsx" filename="src/index.tsx" />

    <Heading level={2} id="table">
      表
    </Heading>

    <table>
      <caption>3パッケージの依存関係（横幅を超えるため横スクロールします）</caption>
      <thead>
        <tr>
          <th>パッケージ</th>
          <th>dependencies</th>
          <th>peerDependencies</th>
          <th>出力</th>
          <th>レイヤ</th>
          <th>備考</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>@cloudensis/tokens</td>
          <td>なし</td>
          <td>なし</td>
          <td>tokens.css</td>
          <td>cds.tokens</td>
          <td>JS を含まない。ダークモードの切り替えロジックはここに集約する</td>
        </tr>
        <tr>
          <td>@cloudensis/prose</td>
          <td>なし</td>
          <td>なし</td>
          <td>prose.css / class.js</td>
          <td>cds.prose</td>
          <td>tokens はフォールバック経由のソフト参照。単体で完全に動く</td>
        </tr>
        <tr>
          <td>@cloudensis/ui</td>
          <td>なし</td>
          <td>hono@^4</td>
          <td>index.js / ui.css</td>
          <td>cds.ui</td>
          <td>Tailwind のユーティリティクラスを出力しない</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td>合計</td>
          <td>0</td>
          <td>1</td>
          <td>—</td>
          <td>3</td>
          <td>—</td>
        </tr>
      </tfoot>
    </table>

    <Heading level={2} id="media">
      画像とメディア
    </Heading>

    <Figure
      src="data:image/svg+xml;utf8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%20640%20360'%3E%3Crect%20width%3D'640'%20height%3D'360'%20fill%3D'%23d4d4d8'%2F%3E%3Ctext%20x%3D'320'%20y%3D'190'%20font-family%3D'sans-serif'%20font-size%3D'28'%20text-anchor%3D'middle'%20fill%3D'%2352525b'%3E640%20%C3%97%20360%3C%2Ftext%3E%3C%2Fsvg%3E"
      alt="ダミー画像"
      width={640}
      height={360}
      ratio="16 / 9"
      caption={
        <>
          <code>Figure</code> のキャプションはパターン A のスロットなので、
          <code>code</code> や <a href="#media">リンク</a> に prose が効きます。
        </>
      }
    />

    <figure>
      <img
        src="data:image/svg+xml;utf8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%20480%20270'%3E%3Crect%20width%3D'480'%20height%3D'270'%20fill%3D'%23e4e4e7'%2F%3E%3Ctext%20x%3D'240'%20y%3D'145'%20font-family%3D'sans-serif'%20font-size%3D'22'%20text-anchor%3D'middle'%20fill%3D'%2352525b'%3E480%20%C3%97%20270%3C%2Ftext%3E%3C%2Fsvg%3E"
        alt="素の figure に入れたダミー画像"
        width={480}
        height={270}
      />
      <figcaption>素の figure / figcaption。</figcaption>
    </figure>

    <picture>
      <img
        src="data:image/svg+xml;utf8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%20480%20120'%3E%3Crect%20width%3D'480'%20height%3D'120'%20fill%3D'%23f4f4f5'%2F%3E%3Ctext%20x%3D'240'%20y%3D'70'%20font-family%3D'sans-serif'%20font-size%3D'20'%20text-anchor%3D'middle'%20fill%3D'%2352525b'%3Epicture%3C%2Ftext%3E%3C%2Fsvg%3E"
        alt="picture の中のダミー画像"
        width={480}
        height={120}
      />
    </picture>

    <Heading level={2} id="details">
      開閉ブロックと長い URL
    </Heading>

    <details>
      <summary>詳細を開く</summary>
      <p>
        <code>details</code> / <code>summary</code> です。Preflight で
        マーカーが消えても同じ見た目になるよう、明示的に指定しています。
      </p>
    </details>

    <p>
      長い URL を含む段落です:{' '}
      <a href="https://example.com/very/long/path/that/keeps/going/and/going/until/it/would/definitely/overflow/the/measure?query=parameter&amp;another=parameter">
        https://example.com/very/long/path/that/keeps/going/and/going/until/it/would/definitely/overflow/the/measure?query=parameter&amp;another=parameter
      </a>{' '}
      — 横スクロールが発生しないことを確認してください。
    </p>

    <p lang="en">
      This paragraph is marked <code>lang="en"</code>. Latin-script ranges fall
      back to a 1.7 line-height and normal letter-spacing, because the values
      tuned for mixed kanji and kana make English look loose and airy.
    </p>

    <p>
      日本語と English が mixed した段落。ascender と descender のある欧文が
      混ざっても、行送りが破綻しないことを見ます。
    </p>

    <DemoButton href="#top">
      これはパターン B。この中には prose が効きません。
    </DemoButton>
  </>
)
