# @cloudensis design system

Hono アプリケーション向けの共通フロントエンド基盤。3つのパッケージを独立して配布します。

| パッケージ | 内容 | 依存 |
|---|---|---|
| [`@cloudensis/tokens`](packages/tokens) | デザイントークン（CSS変数） | なし |
| [`@cloudensis/prose`](packages/prose) | 記事・ドキュメント用のタイポグラフィ CSS | なし |
| [`@cloudensis/ui`](packages/ui) | hono/jsx コンポーネント | `hono`（peer） |

**記事はこのリポジトリの外にあります。** 各サービスのリポジトリで JSX として書かれ、
その中に UI コンポーネントが直接埋め込まれます。したがって `.prose` の内側に
UI コンポーネントが来ることが前提の設計になっています。

> [!IMPORTANT]
> Cloudensis 社内のデザイントークンに基づくライブラリであり、社外での利用を推奨しません。
> MIT ライセンスで公開していますが、外部サポートは行いません。

---

## 目次

- [消費側リポジトリのセットアップ](#消費側リポジトリのセットアップ)
- [Tailwind CSS と併用する場合](#tailwind-css-と併用する場合)
- [カスケードレイヤ — 上書きの保証機構](#カスケードレイヤ--上書きの保証機構)
- [テーマとダークモード](#テーマとダークモード)
- [`.not-prose`](#not-prose)
- [コンポーネントの使い方](#コンポーネントの使い方)
- [コンポーネント追加規約](#コンポーネント追加規約)
- [採用しなかったもの](#採用しなかったもの)
- [開発](#開発)

---

## 消費側リポジトリのセットアップ

### 1. インストール

`hono` は自分で入れてください。`@cloudensis/ui` は `hono` を `peerDependencies`
にしているため、ui を入れただけでは入りません。

```bash
pnpm add hono @cloudensis/tokens @cloudensis/prose @cloudensis/ui
```

3パッケージは SSR でリクエスト時に評価されるため、`devDependencies` ではなく
**`dependencies`** に置いてください。

あわせて、依存ツリー内で hono のバージョンが混ざらないよう `pnpm.overrides` で
統一することを推奨します。hono/jsx は内部状態を持つため、バージョンが混ざると
JSX が描画されないといった分かりにくい壊れ方をします。

```json
{
  "pnpm": { "overrides": { "hono": "$hono" } }
}
```

### 2. CSS

**サブパス付きで import してください。** bare specifier + `exports` のルート指定だと、
バンドラによっては CSS として解決されない場合があります。

```css
/* src/styles/app.css */

/* import 順はレイヤで固定されるため任意ですが、この順を推奨します */
@import "@cloudensis/tokens/tokens.css";
@import "@cloudensis/prose/prose.css";
@import "@cloudensis/ui/ui.css";

/* ここから下はレイヤ外なので全レイヤより強くなります。
   サイト固有の上書きは、詳細度と戦わずにここに書けます */
.article-callout {
  border-radius: 0;
}
```

### 3. tsconfig

**自分で JSX（＝記事）を書く場合にのみ必要です。**
`@cloudensis/ui` のコンポーネントを import するだけなら不要です
（JSX はビルド時に変換済みで、プレーンな ESM として配布しているため）。

```jsonc
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "hono/jsx"
  }
}
```

### 4. 記事を書く

```tsx
import { Hono } from 'hono'
import { Prose, Heading, CodeBlock, Figure } from '@cloudensis/ui'

const app = new Hono()

app.get('/articles/cascade-layers', (c) =>
  c.html(
    <Prose size="lg">
      <Heading level={1}>カスケードレイヤという解決策</Heading>
      <p>本文です。</p>
      <CodeBlock code="const x = 1" lang="ts" filename="example.ts" />
    </Prose>,
  ),
)
```

---

## Tailwind CSS と併用する場合

利用側が Tailwind を使っていても使っていなくても動くことが要件です。
併用する場合は、以下3点に注意してください。

### レイヤ順を明示的に宣言する

Tailwind v4 は内部で `@layer theme, base, components, utilities;` を宣言し、
こちらは `@layer cds.tokens, cds.prose, cds.ui;` を宣言します。
**レイヤ順は最初に宣言された順で決まる**ため、放置すると import 順がそのまま
優先順位になり、どちらの順でも壊れます。

- Tailwind を先に import → `cds.prose` がユーティリティより強くなり、`<p class="mt-0">` が効かない
- こちらを先に import → Preflight が `cds.prose` より強くなり、prose がほぼ全滅する

利用側で明示的に挟ませるのが正解です。

```css
/* @layer の順序宣言は @import より前に置けます */
@layer theme, base, cds.tokens, cds.prose, cds.ui, components, utilities;

@import "tailwindcss";
@import "@cloudensis/tokens/tokens.css";
@import "@cloudensis/prose/prose.css";
@import "@cloudensis/ui/ui.css";
```

### `@tailwindcss/typography` は併用不可

`.prose` が正面衝突します。`@plugin "@tailwindcss/typography";` を削除してください。

### その他

- レイヤ順が正しければ、**`.prose` の内側でも Tailwind のユーティリティがそのまま効きます。**
  小さな調整のために `not-prose` を使う必要はありません。
- `--cds-*` を Tailwind のテーマに橋渡ししたい場合は `@theme inline` を使ってください。
  `inline` を付けないと参照が切れます。

  ```css
  @theme inline {
    --color-accent: var(--cds-color-accent);
    --font-sans: var(--cds-font-sans);
  }
  ```

- Tailwind の `dark:` は既定で `prefers-color-scheme` のみです。
  `.dark` クラス方式で統一するなら、利用側で宣言してください。

  ```css
  @custom-variant dark (&:where(.dark, .dark *));
  ```

---

## カスケードレイヤ — 上書きの保証機構

CSS を出力する全パッケージが、ファイル先頭に同一のレイヤ順宣言を置いています。

```css
@layer cds.tokens, cds.prose, cds.ui;
```

そのうえで、各パッケージの全ルールが自分のレイヤに入っています。得られるものは3つです。

1. **アプリ側の CSS import 順に依存しなくなる。** `ui` が常に `prose` に勝ちます。
2. **レイヤ外（unlayered）の CSS は全レイヤより強い。** アプリ固有の上書きが詳細度と戦わずに効きます。
3. `!important` が不要になります。

```css
/* アプリ側。レイヤ外なので、クラス1つで prose にも ui にも勝ちます */
.my-tweak { margin-block: 0; }
```

レイヤの判定は詳細度より**先に**行われます。`.cds-callout__body p`（詳細度 (0,2,1)）に対して
`.text-sm`（(0,1,0)）が勝つのはこのためです。

> [!NOTE]
> **`:where()` はこの役割を担っていません。**
> `.prose` 配下のセレクタを `:where()` で包んで詳細度を (0,1,0) に揃えているのは、
> 利用側が上書きできるようにするためではなく、`cds.prose` レイヤ**内部**での一貫性のためです。
> レイヤが決めるのは別レイヤとの勝敗だけで、同一レイヤ内では依然として詳細度が効きます。
> prose のルールは数十個あり、それらは全部同じレイヤで競合します。
> 全ルールが (0,1,0) で揃っていれば「後に書いた方が勝つ」という単純な規則だけで全体を読めます。

### ブラウザ対応

`@layer` は**ポリフィルできません。** ブラウザターゲットは `@layer` をサポートする範囲
（Chrome 99+ / Safari 15.4+ / Firefox 97+ 相当）に限定しています。

---

## テーマとダークモード

主要な拡張ポイントは**CSS変数の上書き**です。レイヤ外に書けば必ず勝ちます。

```css
/* アプリ側 */
:root {
  --cds-color-accent: #0f766e;
  --cds-prose-measure: 46em;
}
```

ダークモードは3系統すべてで切り替わり、**手動指定が OS 設定を必ず上書きします。**
切り替えロジックは `@cloudensis/tokens` に集約されており、prose / ui には実装がありません。

| 系統 | 書き方 | 使いどころ |
|---|---|---|
| OS 設定 | （何も付けない） | 既定。ユーザーの設定に従う |
| クラス | `<html class="dark">` | JS でトグルを持つ場合。Tailwind の `dark:` と揃えやすい |
| 属性 | `<html data-theme="dark">` | クラス名の衝突を避けたい場合 |

セレクタは `:root` に限定していないため、**祖先要素に付ければ部分的に切り替えられます。**

```html
<body>
  <main>ライト</main>
  <aside data-theme="dark">ここだけダーク</aside>
</body>
```

`--cds-color-scheme` から `color-scheme` を引いているので、スクロールバーやフォーム部品も
追随します。追随させたくない場合は `--cds-color-scheme` を上書きしてください。

---

## `.not-prose`

`.not-prose` が付いた要素とその子孫すべてで、prose のスタイルが無効になります。

```html
<article class="prose">
  <p>prose が効きます</p>
  <div class="not-prose">
    <p>効きません。子孫すべてで無効です</p>
  </div>
</article>
```

除外句 `:not(:where(.not-prose, .not-prose *))` は**ビルド処理で機械的に全セレクタへ
付与**しています。手書きで書き分けると必ず書き漏らしが出るためです。

なお、Tailwind を併用している場合、小さな調整のために `.not-prose` を使う必要はありません。
レイヤ順が正しければユーティリティがそのまま効きます。

---

## コンポーネントの使い方

`@cloudensis/ui` が提供するのは次の4つだけです。個別コンポーネント（Button、Callout、Tabs など）は
各自で追加してください。

| コンポーネント | 置く理由 |
|---|---|
| `Prose` | 記事の wrapper |
| `Heading` | `id` の自動付与、アンカー、目次生成のためのデータ |
| `CodeBlock` | 言語ラベル、コピーボタン、ハイライタとの接続点 |
| `Figure` | `loading` / `decoding` / アスペクト比、キャプションの構造保証 |

**すべてのコンポーネントが `class` prop を受け取ります。**
自分のクラスの後ろに連結されるので、利用側のクラスが後勝ちになります。
Tailwind クラスでの上書きは、前述のレイヤ順が保証します。

```tsx
<Prose class="mx-auto max-w-3xl">…</Prose>
<CodeBlock code={src} lang="ts" class="my-0" />
```

### シンタックスハイライト

**範囲外です。** `pre code` の色付けは消費側の責務です。
`CodeBlock` には2つの接続点があります。

```tsx
// 1. ビルド時に shiki などで生成した markup をそのまま渡す
<CodeBlock html={await codeToHtml(src, { lang: 'ts', theme: 'github-dark' })} />

// 2. 省略すると <pre><code class="language-ts"> を出力する
//    （highlight.js / Prism が実行時に探す形）
<CodeBlock code={src} lang="ts" />
```

`pre` の配下には色を一切指定していないので、どちらの場合もハイライタと衝突しません
（shiki はインラインスタイル、highlight.js はレイヤ外の CSS を配るため、両方ともこちらに勝ちます）。

### コピーボタン

`CodeBlock` はコピーボタンの markup だけを出力し、**JavaScript は同梱しません**
（クライアントサイドの実装は非目的）。アプリ側で数行のリスナを置いてください。

```js
document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-cds-copy]')
  if (!button) return
  const code = button.closest('.cds-code-block')?.querySelector('pre')?.textContent
  if (code) navigator.clipboard.writeText(code)
})
```

### 目次

`Heading` は `data-cds-heading-level` と `data-cds-heading-text` を出力します。

```tsx
import { extractText } from '@cloudensis/ui/utils'
```

`extractText()` は JSX ノードからプレーンテキストを抽出します（OGP description、RSS、検索インデックス用）。

---

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

- **`class` prop を例外なく受け取り、`cn()` で自分のクラスの後ろに連結する。**
- **クラスは `cds-` 接頭辞 + BEM。Tailwind のユーティリティクラスを出力しない。**
  Tailwind は既定で `node_modules` を走査しないため、ui がユーティリティクラスを吐くと、
  利用側が `@source` でスキャン対象を追加しない限りそのクラスが生成されず、
  スタイルが当たらないという壊れ方をします。
- **CSS は `@layer cds.ui` に入れる。** `!important` は使わない。
- **境界の引き方は「振る舞いと構造を持つか」。**
  `p` / `ul` / `blockquote` / `table` のような純粋な組版は prose の CSS が担当し、
  コンポーネントにしません。CSS では実現できない責務を持つものだけを昇格させます。

### 接頭辞 `--cds-` は必須

CSS カスタムプロパティには名前空間の仕組みが無く、`:root` に定義した変数は全要素から見えます。
接頭辞を省くと Tailwind v4 のテーマ変数（`--color-*` / `--spacing` / `--font-*` / `--radius-*` /
`--shadow-*` / `--text-*` など）と正面衝突し、**デザイントークンが意図せず Tailwind ユーティリティの
定義そのものになります**（`bg-accent` は `var(--color-accent)` を引くため）。
ダークモードでトークンを切り替えるとアプリ中のユーティリティが連動して変わる、といった
追跡困難な不具合になります。

接頭辞があれば、この結合は `@theme inline` で**明示的に繋いだときだけ**発生します。
prose の内部変数も `--cds-prose-*` とし、名前空間を `cds` ひとつに統一しています。

---

## 採用しなかったもの

議論の結果、採用しないと決めたものです。理由ごと記録します。

### `@scope`

`@scope (.prose) to (.not-prose)` を使えば `.not-prose` の除外句が不要になり、
セレクタも `h2 { }` と短く書けます。**それでも採用しません。**

理由は失敗の仕方です。`@scope` 非対応のブラウザではスコープブロックごと無効になり、
**記事が完全に無スタイルになります。** 段階的に劣化せず全損します。
得られるのは記述の綺麗さと出力量の削減（除外句は繰り返しが多く gzip がよく効くため、
実転送量の差は小さい）であって機能ではないので、この失敗モードには見合いません。

複数リポジトリに配られ、どのサービスがどの顧客層を持つか個別に把握しきれない
ライブラリである、というのが判断の前提です。将来見直してよい判断です。

### `clsx` / `tailwind-merge`

レイヤ順が上書きを保証するため不要です。ui は依存ゼロを維持します。

- `clsx` が買えるのはオブジェクト記法（`{ 'is-active': active }`）ですが、三項演算子で代替できます。
  バリアント管理が必要になるほど育った段階で `cva` などの導入を検討すればよく、
  そのとき `clsx` は推移的に入ってきます。今入れる理由はありません。
- `tailwind-merge` が必要になるのは、**ui 自身が Tailwind ユーティリティを出力する場合**に
  限られます。ui は `cds-*` クラスで完結させる規約なので、ユーティリティ同士の衝突は
  原理的に発生せず、`tailwind-merge` には仕事がありません。
  そもそも `.cds-callout__body p`（(0,2,1)）に対して `.text-sm`（(0,1,0)）が勝つような
  上書きは `tailwind-merge` では解決できません（文字列操作なので他要素のセレクタを知り得ない）。

### `tailwindcss`（ui の依存として）

Tailwind 非使用リポジトリでの動作を要件として維持するためです。

### Markdown パーサ

記事は JSX で書きます。MDX 相当の機能も実装しません。

### その他の非目的

- シンタックスハイライト（消費側の責務）
- CSS リセット / normalize
- クライアントサイドの状態管理、`hono/jsx/dom` 向けの実装
- 個別の UI コンポーネント（上記4つを除く）

---

## 開発

```bash
pnpm install
pnpm build          # 3パッケージをビルド
pnpm storybook      # ビルドしてから Storybook を起動
pnpm verify         # build + typecheck + check:css + test + publint + pack
```

### なぜ1リポジトリなのか

3パッケージは独立して配布されますが、カスケードレイヤの順序、トークンの命名、
`.prose` と UI コンポーネントの干渉といった**設計上の取り決めが3つにまたがる**ためです。
分割すると、それを同時に検証する場所が存在しなくなります。
`apps/storybook` がその検証場所であり、同時に社内向けのカタログを兼ねます。

### 構成

```
design-system/
├── packages/
│   ├── tokens/          @cloudensis/tokens
│   ├── prose/           @cloudensis/prose
│   └── ui/              @cloudensis/ui
├── apps/
│   └── storybook/       Storybook（検証・カタログ。非公開）
├── scripts/
│   ├── css-lib.mjs      レイヤ順・.not-prose 除外句の共通ビルド処理
│   ├── check-css.mjs    受け入れ条件の機械チェック
│   └── pack-report.mjs  npm pack --dry-run の同梱ファイル一覧
└── tests/               ビルド済みパッケージの import スモークテスト
```

### Storybook

`apps/storybook` は各パッケージの **`dist`（ビルド後の成果物）を参照**します。
`src` を直接見ると、`exports` の設定ミスやビルド時の CSS 変換の不具合を検出できません。

ツールバーから切り替えられるもの:

- **Theme** — `light` / `dark` / `data-theme="dark"` / `class="dark"` を個別に試せます。
- **Tailwind** — Preflight 込みの Tailwind を有効・無効にします。

> [!NOTE]
> `prefers-color-scheme` は JS から偽装できません。OS 設定由来の分岐と、
> 「手動指定が OS 設定を上書きする」ことの確認は、ブラウザ DevTools の
> エミュレーション機能（Rendering パネル）で手動で行ってください。

最新の Storybook は `main` への push ごとに GitHub Pages へ配信されます。

### リリース

- [Changesets](https://github.com/changesets/changesets) で3パッケージを独立バージョニング
- publish は **CI からのみ**。個人端末から `npm publish` しないこと
- npm の Trusted Publishing（GitHub Actions の OIDC 連携）+ `--provenance`
- 初期は全パッケージ `0.x`。トークン名とクラス名が固まった時点で `1.0.0`

```bash
pnpm changeset          # 変更内容を記録
```

npm のレジストリは不変で、一度公開した名前とバージョンの組み合わせは unpublish しても
再利用できません。`pnpm check:pack` の同梱ファイル一覧を必ずレビューしてください。

---

## ライセンス

[MIT](LICENSE)
