# @cloudensis/ui

Cloudensis の記事のための hono/jsx コンポーネント。
**`dependencies` は空**で、`hono` のみが `peerDependencies` です。

> Cloudensis 社内のデザイントークンに基づくライブラリであり、社外での利用を推奨しません。
> MIT ライセンスで公開していますが、外部サポートは行いません。

```bash
pnpm add hono @cloudensis/prose @cloudensis/ui
```

`hono` は自分で入れてください。`peerDependencies` なので、ui を入れただけでは入りません。
`dependencies` に入れてしまうとアプリ側と hono のインスタンスが二重になります。

```css
/* CSS は JS から import されないので、アプリ側で集約してください */
@import "@cloudensis/prose/prose.css";
@import "@cloudensis/ui/ui.css";
```

```tsx
import { Prose, Heading, CodeBlock, Figure } from '@cloudensis/ui'

app.get('/articles/:slug', (c) =>
  c.html(
    <Prose size="lg">
      <Heading level={1}>タイトル</Heading>
      <p>本文です。</p>
    </Prose>,
  ),
)
```

JSX は**ビルド時に変換済みのプレーンな ESM** として配布しています。
自分で JSX（＝記事）を書かない限り、tsconfig の設定なしに import できます。
書く場合は `jsx: "react-jsx"` / `jsxImportSource: "hono/jsx"` を設定してください。

## コンポーネント

| コンポーネント | パターン | 置く理由 |
|---|---|---|
| `Prose` | A | 記事の wrapper |
| `Heading` | A | `id` の自動付与、アンカー、目次生成のためのデータ |
| `CodeBlock` | B | 言語ラベル、コピーボタン、ハイライタとの接続点 |
| `Figure` | A | `loading` / `decoding` / アスペクト比、キャプションの構造保証 |

**境界の引き方は「振る舞いと構造を持つか」です。**
`p` / `ul` / `blockquote` / `table` のような純粋な組版は `@cloudensis/prose` の CSS が担当し、
コンポーネントにしません。上の4つは CSS では実現できない責務を持つため昇格させています。

個別コンポーネント（Button、Callout、Tabs など）はここには入れません。各リポジトリ、
あるいは将来このパッケージに追加する際は、下記の規約に従ってください。

### `Prose`

```tsx
<Prose size="lg" full as="article" class="mx-auto">…</Prose>
```

| prop | 既定 | |
|---|---|---|
| `size` | `'base'` | `'sm' \| 'base' \| 'lg' \| 'xl'` |
| `full` | `false` | `max-width: none` |
| `as` | `'article'` | `'article' \| 'div' \| 'section'` |
| `class` | — | 後ろに連結されます |

クラス名は `@cloudensis/prose/class` の `proseClass()` が組み立てます。
`"prose"` という文字列をハードコードせず、ui → prose の依存を型付きにするためです。

### `Heading`

```tsx
<Heading level={2}>カスケードレイヤという解決策</Heading>
// <h2 id="カスケードレイヤという解決策" class="cds-heading"
//     data-cds-heading-level="2" data-cds-heading-text="…">…<a class="cds-heading__anchor not-prose" …>#</a></h2>
```

| prop | 既定 | |
|---|---|---|
| `level` | `2` | `1`〜`6` |
| `id` | 見出しテキストの slug | |
| `anchor` | `true` | `#` アンカーを出力 |
| `anchorLabel` | `(t) => \`${t} へのリンク\`` | スクリーンリーダー向けラベル |

slug は NFKC 正規化のうえ記号と空白を落としたものです。CJK はそのまま残します
（HTML5 で有効であり、ローマ字への推測変換は元より悪くなるため）。

目次は `data-cds-heading-level` / `data-cds-heading-text` から組み立てられます。

### `CodeBlock`

```tsx
<CodeBlock code={src} lang="ts" filename="src/index.ts" />
<CodeBlock html={await codeToHtml(src, { lang: 'ts', theme: 'github-dark' })} />
```

| prop | 既定 | |
|---|---|---|
| `code` | `''` | ソース。`html` があれば無視されます |
| `lang` | — | ラベルと `language-*` クラスに使われます |
| `label` | `lang` | 表示上のラベルを差し替え |
| `filename` | — | |
| `copy` | `true` | コピーボタンの markup を出力 |
| `html` | — | ハイライタが生成済みの markup をそのまま出力 |

**シンタックスハイライトは範囲外です。** `pre` の配下には色を一切指定していないので、
shiki（インラインスタイル）とも highlight.js（レイヤ外 CSS）とも衝突しません。

コピーボタンは markup だけで、**JavaScript は同梱していません**。アプリ側で:

```js
document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-cds-copy]')
  if (!button) return
  const code = button.closest('.cds-code-block')?.querySelector('pre')?.textContent
  if (code) navigator.clipboard.writeText(code)
})
```

### `Figure`

```tsx
<Figure src="/hero.webp" alt="" width={1280} height={720} ratio="16 / 9" caption={<>説明</>} />
```

| prop | 既定 | |
|---|---|---|
| `loading` | `'lazy'` | |
| `decoding` | `'async'` | |
| `ratio` | — | `aspect-ratio`。読み込み前に領域を確保しレイアウトシフトを防ぎます |
| `caption` | — | `figcaption` の中身。prose が効きます |
| `children` | — | 既定の `<img>` を差し替え |

## ユーティリティ

```ts
import { extractText, slugify } from '@cloudensis/ui/utils'

extractText(node)   // JSX ノードからプレーンテキスト（OGP description、RSS、検索インデックス用）
slugify(text)       // URL フラグメント
```

`extractText()` は関数コンポーネントを呼び出しません。コンポーネント**に渡された** children を
読むだけで、コンポーネントが生成する文字列は含みません。

## `class` prop

**すべてのコンポーネントが例外なく `class` prop を受け取り、`cn()` で自分のクラスの後ろに
連結します。** これが利用側がスタイルを調整する経路です。

```tsx
<CodeBlock code={src} class="my-0" />
```

**Tailwind クラスでの上書きはカスケードレイヤ順が保証します。**
ui のスタイルは `cds.ui` レイヤ、Tailwind のユーティリティは後続の `utilities` レイヤにあり、
レイヤの判定は詳細度より先に行われます。

```css
@layer cds.ui { .cds-code-block { margin-block: 1.75em; } }  /* (0,1,0) */
@layer utilities { .my-0 { margin-block: 0; } }              /* (0,1,0) */
```

詳細度が負けていても勝てます。`.cds-callout__body p`（(0,2,1)）に対して
`.text-sm`（(0,1,0)）が勝ちます。**これは `tailwind-merge` では解決できません**
（文字列操作なので他要素のセレクタを知り得ないため）。

## 依存はゼロ

`clsx` / `tailwind-merge` / `tailwindcss` はいずれも入れていません。クラス結合は3行です。

```ts
export const cn = (...inputs: ClassValue[]): string | undefined =>
  inputs.filter(Boolean).join(' ') || undefined
```

`|| undefined` が必要なのは、空文字だと hono/jsx が `class=""` を出力するためです。
`undefined` なら属性ごと省かれます。

オブジェクト記法は使えませんが、三項演算子で代替できます。
バリアント管理が必要になるほど育った段階で `cva` などの導入を検討すればよく、
そのとき `clsx` は推移的に入ってきます。

`@cloudensis/prose/class` はビルド時にインライン化しています（`devDependencies` 扱い）。
`dependencies` を空に保ちつつ、ui → prose の依存を型付きの import として書くためです。
CSS を使うので `@cloudensis/prose` 自体は別途インストールしてください。

## コンポーネント追加規約

記事の JSX から `.prose` の内側に置かれるため、**各コンポーネントは「記事本文を受け取るか」を
明示**する必要があります。ソース冒頭に A か B かをコメントで残してください。

### パターン A: 本文を受け取る（Callout、Figure、Details など）

装飾部分にだけ `not-prose` を付け、children のスロットは開けておきます。
**根に `not-prose` を付けると中の本文まで prose から外れるため禁止です。**

```tsx
export const Callout = ({ tone = 'info', class: className, children }: PropsWithChildren<CalloutProps>) => (
  <aside class={cn('cds-callout', `cds-callout--${tone}`, className)}>
    <div class="cds-callout__icon not-prose" aria-hidden="true">{/* ... */}</div>
    <div class="cds-callout__body">
      {children}   {/* prose が効いてほしい場所。not-prose を被せない */}
    </div>
  </aside>
)
```

### パターン B: 本文を受け取らない（Button、Tabs、Badge など）

根に `not-prose` を付けて丸ごと隔離します。

```tsx
export const Button = ({ href, class: className, children }: PropsWithChildren<ButtonProps>) => (
  <a href={href} class={cn('cds-button', 'not-prose', className)}>{children}</a>
)
```

### 守るべきこと

- `class` prop を例外なく受け取り、`cn()` で自分のクラスの後ろに連結する
- クラスは `cds-` 接頭辞 + BEM
- **Tailwind のユーティリティクラスを出力しない。**
  Tailwind は既定で `node_modules` を走査しないため、ui がユーティリティクラスを吐くと、
  利用側が `@source` でスキャン対象を追加しない限りそのクラスが生成されず、
  スタイルが当たらないという壊れ方をします
- CSS は `src/ui.css` の `cds.ui` レイヤに入れる。`!important` は使わない
- JS から CSS を import しない。バンドラや Workers 向けビルドで挙動が割れます

`pnpm check:css` がこれらのうち機械的に検証できるものを検査します。

## ライセンス

MIT
