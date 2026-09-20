# @cloudensis/prose

記事・ドキュメント用のタイポグラフィ CSS。**日本語主体のコンテンツを既定**としています。
依存はありません。

> Cloudensis 社内のデザイントークンに基づくライブラリであり、社外での利用を推奨しません。
> MIT ライセンスで公開していますが、外部サポートは行いません。

```bash
pnpm add @cloudensis/prose
```

```css
@import "@cloudensis/prose/prose.css";
```

```html
<article class="prose">
  <h1>見出し</h1>
  <p>本文です。</p>
</article>
```

`@cloudensis/tokens` は `dependencies` に入っていません。CSS変数のフォールバック経由で
参照するだけなので、**tokens が無くても単体で完全に動きます。**

```css
.prose { --cds-prose-body: var(--cds-color-fg, #3f3f46); }
```

## クラス

| クラス | 効果 |
|---|---|
| `.prose` | 本体。`font-size: 1rem`、`max-width: var(--cds-prose-measure)` |
| `.prose-sm` / `.prose-lg` / `.prose-xl` | サイズモディファイア（0.875 / 1.125 / 1.25rem）。`.prose` と併用する多クラス方式 |
| `.prose-full` | `max-width: none` |
| `.lead` | 導入文 |
| `.not-prose` | その要素と子孫すべてで prose を無効化 |

配下はすべて `em` で記述しているため、サイズモディファイアは1か所の変更で成立します。

```tsx
import { proseClass } from '@cloudensis/prose/class'

proseClass({ size: 'lg', full: true })   // 'prose prose-lg prose-full'
```

`proseClass()` はゼロ依存の TS モジュールです（hono には一切触れません）。
利用側が `prose-*` を明示的に渡した場合は、`size` 由来のものを落とします。
`prose-lg` と `prose-sm` は同一レイヤ・同一詳細度なので、両方出力すると
CSS の記述順で結果が決まり予測できなくなるためです。**この衝突はカスケードレイヤでは解けません。**

## 対応する要素

見出し `h1`〜`h6`、`p` / `a` / `strong` / `em` / `del` / `s` / `mark` / `small` /
`sub` / `sup` / `abbr`、`ul` / `ol` / `li`（3階層のネスト）、`dl` / `dt` / `dd`、
`blockquote`（ネスト含む）、`hr`、`code` / `pre` / `pre > code` / `kbd` / `samp` / `var`、
`table` 一式（横幅超過時は表自身が横スクロール）、`img` / `figure` / `figcaption` /
`picture` / `video`、`details` / `summary`。

## 日本語組版

欧文向けの数値をそのまま使っていません。

| 項目 | 値 | 理由 |
|---|---|---|
| `line-height` | `1.8` | 欧文向けの 1.6 前後では漢字かな交じり文が詰まって見える |
| `letter-spacing` | `0.02em` | |
| `--cds-prose-measure` | `40em` | 日本語は1文字が1emなので `65ch` では1行が長すぎる |
| `line-break` | `strict` | 禁則処理 |
| `overflow-wrap` | `anywhere`（`p` / `li`） | 長い URL で横スクロールさせない |
| `text-wrap` | 見出しに `balance`、`p` に `pretty` | |

`font-feature-settings: "palt"` は本文では使っていません。
`letter-spacing` と衝突して字間が不揃いになるためです。

`:lang(en)` の範囲では `line-height: 1.7` / `letter-spacing: normal` / `measure: 65ch` に戻ります。
`lang` は DOM で継承されるので、`<section lang="en">` を付ければ配下の段落すべてに効きます。

## `.not-prose`

```html
<article class="prose">
  <p>prose が効きます</p>
  <div class="not-prose">
    <p>効きません。子孫すべてで無効です</p>
  </div>
</article>
```

除外句 `:not(:where(.not-prose, .not-prose *))` は**ビルド処理で機械的に全セレクタへ
付与**しています（`packages/prose/build.mjs`）。手書きで書き分けると必ず書き漏らしが出ます。

`.prose` **直下**に置いた `.not-prose` 要素は、段落と同じ上下の余白を受け取ります。
記事の流れの中にある以上、垂直リズムからは外さないほうが正しいためです。

## `.prose` 直下の垂直リズム

`.prose` の直下には UI コンポーネントが来ます。段落と同じ余白を任意の子要素に与えているので、
記事側で余白調整を書く必要はありません。

```css
.prose > :where(*) { margin-block: 1.25em; }
.prose > :where(:first-child) { margin-block-start: 0; }
.prose > :where(:last-child)  { margin-block-end: 0; }
```

## 上書き

**`cds.prose` レイヤの外に書けば、クラス1つで必ず勝ちます。**
`!important` も詳細度の積み上げも不要です。

```css
/* アプリ側。レイヤ外 */
.article-note { margin-block: 0; }
```

`.prose` 配下の全セレクタは `:where()` で包んで詳細度を (0,1,0) に揃えていますが、
**これは利用側の上書きのためではありません。** 上書きはレイヤが保証します。
`:where()` が担うのは `cds.prose` レイヤ内部での一貫性 —
全ルールが同じ詳細度なので「後に書いた方が勝つ」だけで読める — です。

`!important` は1つも使っていません。`@scope` も使っていません
（非対応ブラウザで記事が全損するため。[理由の詳細](https://github.com/cloudensis/design-system#scope)）。

## シンタックスハイライト

**範囲外です。** `pre code` の色付けは消費側の責務です。

`pre` の配下には色を一切指定していないため、ハイライタと衝突しません。
shiki はインラインスタイルを書き、highlight.js はレイヤ外の CSS を配るので、両方ともこちらに勝ちます。

## Tailwind CSS

Preflight のようなリセットが当たっている前提では書いていません。
`list-style-type` や見出しの `font-size` を明示しているため、
**Tailwind を使っていないリポジトリでも、使っているリポジトリでも同じ見た目になります。**

`@tailwindcss/typography` とは**併用不可**です（`.prose` が正面衝突します）。
レイヤ順の宣言については[ルートの README](https://github.com/cloudensis/design-system#tailwind-css-と併用する場合) を参照してください。

## ライセンス

MIT
