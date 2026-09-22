# @cloudensis/design-system

cloudensis で利用する CSS トークン・記事用スタイル・コンポーネントを提供します。コンポーネントは Hono の JSX で実装しており、SSR・CSR・SSG のいずれからも利用できます。

## 必要なもの

- Tailwind CSS v4
- Hono v4

## インストール

```sh
npm install @cloudensis/design-system
```

## セットアップ

Tailwind CSS のエントリで次の 1 行を読み込みます。

```css
@import "tailwindcss";
@import "@cloudensis/design-system/index.css";
```

フォント・トークン・既定のスタイル・記事用スタイルの定義に加えて、コンポーネントが使用しているクラスの収集設定（`@source`）もこのファイルに含まれているため、利用側での追加設定は不要です。

## トークン

色と文字の太さはセマンティックな名前のトークンで定義しています。値はこのパッケージが所有しており、Tailwind の既定パレットは参照していません。コンポーネントも `neutral-*` のような生のパレットは使わず、すべてこのトークン経由で配色しています。

| トークン               | 値        | 用途                         |
| ---------------------- | --------- | ---------------------------- |
| `--color-fg`           | `#525252` | 本文の文字色                 |
| `--color-fg-muted`     | `#737373` | 補助的な文字色               |
| `--color-bg`           | `#f5f5f5` | ページの背景                 |
| `--color-surface`      | `#fafafa` | カードなど、背景の上に置く面 |
| `--color-border`       | `#e5e5e5` | 区切り線・入力欄の枠線       |
| `--color-accent`       | `#262626` | ボタンなど主要な操作の塗り   |
| `--color-accent-hover` | `#404040` | その hover                   |
| `--color-accent-fg`    | `#ffffff` | アクセント色の上に置く文字色 |
| `--color-code-bg`      | `#121212` | コードブロックの背景         |
| `--color-code-fg`      | `#dbd7ca` | コードブロックの文字色       |
| `--color-code-border`  | `#2c2c2c` | コードブロックの枠線         |
| `--font-weight-base`   | `300`     | 本文の太さ                   |
| `--font-weight-strong` | `500`     | `b` / `strong` の太さ        |

いずれも `bg-accent` や `text-fg-muted`、`font-strong` のようなユーティリティクラスとして利用できます。

## 既定のスタイル

`body` には次のスタイルが既定で適用されます。利用側で配色や文字の太さのクラスを指定する必要はありません。

```css
body {
  background-color: var(--color-bg);
  color: var(--color-fg);
  font-weight: var(--font-weight-base); /* 300 */
}

b,
strong {
  font-weight: var(--font-weight-strong); /* 500 */
}
```

`b` / `strong` を明示しているのは、Tailwind の preflight が指定する `font-weight: bolder` が、継承値 300 に対して 400 にしか解決されず本文と区別がつかないためです。

`@layer base` で定義しているため、ユーティリティクラス（`bg-*` / `text-*` / `font-*`）を指定すればいつでも上書きできます。配色をまとめて変えたい場合は、利用側の `@theme` でトークンを上書きしてください。

```css
@import "tailwindcss";
@import "@cloudensis/design-system/index.css";

@theme {
  --color-bg: #ffffff;
  --color-fg: #171717;
}
```

## フォント

欧文に [Outfit](https://fonts.google.com/specimen/Outfit)、和文に [Noto Sans JP](https://fonts.google.com/noto/specimen/Noto+Sans+JP) を使用します。webfont は Fontsource の可変フォントを依存に含めており、`index.css` を読み込むだけで同一オリジンから配信されます（外部 CDN への接続は発生しません）。woff2 は `unicode-range` で分割されているため、ブラウザは表示に必要なスライスだけを取得します。

フォントの指定は `--font-sans` トークン 1 つにまとまっています。

```css
--font-sans:
  "Outfit Variable", "Noto Sans JP Variable", ui-sans-serif, system-ui,
  sans-serif;
```

Tailwind CSS v4 は `--default-font-family` として `--font-sans` を参照するため、この定義だけで既定のフォントに反映されます。欧文・数字は Outfit で描画され、Outfit が字形を持たない和文は Noto Sans JP に落ちます。

本文の文字の太さはライト（300）が既定です。太さは `--font-weight-base` / `--font-weight-strong` の 2 つのトークンで管理しており、`font-base` / `font-strong` のユーティリティクラスからも利用できます。個別に変えたい要素には `font-normal` などを指定してください。

webfont を利用側で読み込みたい場合（`next/font` を使う、フォントを差し替えるなど）は、`index.css` の代わりに `tokens.css` と `base.css` と `prose.css` を個別に読み込み、`@source` を自分で指定してください。

## 使い方

```tsx
import { Button, LinkButton } from "@cloudensis/design-system/components/ui/button";
import { Input } from "@cloudensis/design-system/components/ui/input";
import { Select } from "@cloudensis/design-system/components/ui/select";
import { Textarea } from "@cloudensis/design-system/components/ui/textarea";
import { CodeBlock } from "@cloudensis/design-system/components/ui/code-block";

<Input id="email" name="email" type="email" required />
<Select name="type">
	<option value="">選択してください</option>
</Select>
<Textarea name="message" rows={4} />
<Button type="submit">送信</Button>
<LinkButton href="/">リンク</LinkButton>
<CodeBlock lang="sh">{`npm install`}</CodeBlock>
```

記事本文には `.prose` を付与します。

```tsx
<article class="prose">...</article>
```

## 記事スタイル（prose）

`.prose` を付けた要素の中では、記事に現れる HTML タグに本文向けのスタイルが当たります。対応しているタグは次のとおりです。

| 分類           | タグ                                                                                                              |
| -------------- | ----------------------------------------------------------------------------------------------------------------- |
| 見出し         | `h1` / `h2` / `h3` / `h4` / `h5` / `h6`                                                                           |
| 段落・区切り   | `p` / `br` / `hr`                                                                                                 |
| リスト         | `ul` / `ol` / `li`                                                                                                |
| 定義リスト     | `dl` / `dt` / `dd`                                                                                                |
| 引用           | `blockquote` / `q` / `cite`                                                                                       |
| コード         | `pre` / `code` / `samp` / `kbd` / `var`                                                                           |
| 表             | `table` / `caption` / `thead` / `tbody` / `tfoot` / `tr` / `th` / `td`                                            |
| 図版           | `figure` / `figcaption` / `img` / `picture` / `video` / `svg`                                                     |
| テキストレベル | `a` / `strong` / `b` / `em` / `i` / `mark` / `small` / `del` / `ins` / `s` / `u` / `sub` / `sup` / `abbr` / `dfn` |
| 開閉           | `details` / `summary`                                                                                             |

ブロックの余白は下方向にだけ持たせています。隣接する `margin` の相殺に頼らないため、`.prose` を flex や grid の中に置いてもブロック同士の間隔は変わりません。見出しと `hr` の手前だけは例外で、直前のブロックの下余白を `:has()` で広げて距離を取ります。見出し側に上余白を持たせないので、余白が二重になりません。コンテナの先頭と末尾の余白は打ち消しているため、`.prose` を付けた要素に `padding` を与えても上下だけ広く見えることはありません。

```css
/* ブロックの余白は下方向にだけ持たせる */
.prose
  :where(
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    p,
    ul,
    ol,
    dl,
    pre,
    blockquote,
    figure,
    table,
    details,
    hr
  ) {
  margin-block: 0 1.25em;
}

/* 見出しは続く本文と近づける */
.prose :where(h1, h2, h3, h4, h5, h6) {
  margin-block-end: 0.75em;
}

/* 見出しと hr の手前は、直前のブロックの下余白を広げて距離を取る */
.prose :where(:has(+ :is(h1, h2, h3, h4, h5, h6, hr))) {
  margin-block-end: 2.5em;
}
```

セレクタはすべて `:where()` で包んで詳細度を 0 にしたうえで `@layer components` に置いているため、本文中の要素に Tailwind のユーティリティクラス（`text-*` / `font-*` / `my-*` など）を指定すればいつでも上書きできます。配色はトークンを参照しているので、`@theme` でトークンを差し替えると本文にも反映されます。

コードブロック（`pre`）は `CodeBlock` コンポーネントと同じ見た目にそろえており、ページの配色に関わらず常にダークで表示します。

## Tooltip

ホバー（とフォーカス）で補足を表示します。開閉は CSS だけで行うため、クライアント JavaScript を読み込まずに SSG・SSR・CSR のいずれでも動作します。

```tsx
<Tooltip label="補足の説明">
	<pre tabindex={0}>...</pre>
</Tooltip>
<Tooltip label="下に表示します" placement="bottom">...</Tooltip>
```

ラベルは `pointer-events-none` を指定しているため、表示中でもクリックやホバーを遮りません。キーボードから表示するには、中の要素がフォーカスを受け取れる必要があります（`tabindex` を指定するなど）。

## CodeBlock

`lang` を渡すとシンタックスハイライトが付きます。省略した場合はハイライトせずそのまま表示します。

```tsx
<CodeBlock lang="tsx">{code}</CodeBlock>
<CodeBlock>{code}</CodeBlock>
```

コードブロックは、ページの配色に関わらず常にダークで表示します。配色は `--color-code-*` トークンで定義しており、Shiki のテーマ（vitesse-dark）と合わせています。

ハイライトには [Shiki](https://shiki.style/) を使用しています。文法とテーマをパッケージに同梱した同期版のハイライターを使うため、`await` は不要で、SSG・SSR・CSR のいずれからでも同じように呼び出せます。正規表現エンジンは WASM を必要としない JavaScript 実装を選んでいるので、Cloudflare Workers やブラウザでもそのまま動作します。

文法・テーマ・正規表現エンジンは `CodeBlock`（と `lib/highlight`）を読み込んだ時点でまとめてバンドルに含まれます。`lang` を渡さない場合も同じです。SSR・SSG では配信サイズに影響しませんが、CSR でクライアントのバンドルに含めると minify 後でおよそ 830 KB（gzip でおよそ 130 KB）増えます。クライアントで描画する必要がなければ、`CodeBlock` はサーバー側だけで使ってください。

同梱している文法は次のとおりです。ここにない言語を `lang` に渡すことはできません（型で弾かれます）。

| `lang` に渡せる値                               | 文法             |
| ----------------------------------------------- | ---------------- |
| `css`                                           | CSS              |
| `html`                                          | HTML             |
| `javascript` / `js`                             | JavaScript       |
| `json` / `jsonc`                                | JSON             |
| `markdown` / `md`                               | Markdown         |
| `shellscript` / `sh` / `bash` / `shell` / `zsh` | Shell            |
| `tsx` / `ts` / `typescript` / `jsx`             | TypeScript / TSX |
| `yaml` / `yml`                                  | YAML             |

右上のボタンでコード全体をクリップボードにコピーします。コピーに成功するとアイコンがチェックマークに変わり、2 秒後に元に戻ります。

コピーの処理はボタンの `onclick` 属性に書いた数行のインラインハンドラーだけで行います。hono/jsx の SSR（SSG を含む）では属性としてそのまま HTML に出力され、`hono/jsx/dom` による CSR でも属性として設定されるため、ハイドレーションや別途のスクリプト読み込みなしに SSG・SSR・CSR のいずれから描画しても動作します。

クリップボード API が使えない環境（HTTP で配信している場合など）や書き込みが拒否された場合は、コード全体を選択した状態にするので、Ctrl / Cmd + C でコピーできます。

インラインハンドラーを使うため、CSP で `script-src` を制限している場合は、`'unsafe-hashes'` とハンドラーのハッシュを追加してください。許可されるのはこのハンドラーだけなので、`'unsafe-inline'` を追加する必要はありません（XSS への防御が大きく弱まるため、追加しないでください）。nonce や `'strict-dynamic'` と併用しても動作します。

```
Content-Security-Policy: script-src 'self' 'unsafe-hashes' 'sha256-wF1VEFzEsSuwjFla0DgdENA2ZrpzLrVe/rbZm+MK5ME='
```

ハッシュはハンドラーの内容から計算するため、ハンドラーを変更したバージョンでは値が変わります。CSP が効いていると、ハッシュが一致しない場合にコピーできなくなります（ブラウザのコンソールに違反が出力されます）。

CSR では、`require-trusted-types-for 'script'`（Trusted Types）を強制しているページで描画するとエラーになります。インラインハンドラーを属性として設定する処理が拒否されるためです。

## Header / Footer

サイト共通のヘッダー・フッターです。ブランド名やリンクなどサイトごとに異なる内容は props で渡します。

```tsx
import { Header } from "@cloudensis/design-system/components/layout/header";
import { Footer } from "@cloudensis/design-system/components/layout/footer";

<Header homeHref="/" title="cloudensis" />

<Footer
	copyrightHolder={company.name}
	links={[{ href: "/privacy", label: "プライバシーポリシー" }]}
/>
```

`Header` のロゴは `LogoIcon`（cloudensis のロゴマーク）で固定です。`children` を渡すとロゴ・ブランド名の右側に並びます（ナビゲーションやボタンなど）。`Footer` は `links` の代わりに `children` を渡すと、コピーライト表記の右側を自由な内容に差し替えられます。

## エントリ一覧

| import                                                     | 内容                                                         |
| ---------------------------------------------------------- | ------------------------------------------------------------ |
| `@cloudensis/design-system/index.css`                      | 下記をまとめたエントリ（通常はこれを読み込む）               |
| `@cloudensis/design-system/fonts.css`                      | Outfit / Noto Sans JP の `@font-face` 定義                   |
| `@cloudensis/design-system/tokens.css`                     | `@theme` によるトークン定義                                  |
| `@cloudensis/design-system/base.css`                       | `body` の既定のスタイル（配色・文字の太さ）                  |
| `@cloudensis/design-system/prose.css`                      | 記事本文用のスタイル                                         |
| `@cloudensis/design-system/components/ui/button`           | `Button` / `LinkButton`                                      |
| `@cloudensis/design-system/components/ui/code-block`       | `CodeBlock`                                                  |
| `@cloudensis/design-system/components/ui/input`            | `Input`（`type` に応じてチェックボックス・ラジオにも対応）   |
| `@cloudensis/design-system/components/ui/select`           | `Select`                                                     |
| `@cloudensis/design-system/components/ui/textarea`         | `Textarea`                                                   |
| `@cloudensis/design-system/components/ui/tooltip`          | `Tooltip`                                                    |
| `@cloudensis/design-system/components/ui/description-list` | `DescriptionList`                                            |
| `@cloudensis/design-system/components/layout/section`      | `Section`                                                    |
| `@cloudensis/design-system/components/layout/header`       | `Header`                                                     |
| `@cloudensis/design-system/components/layout/footer`       | `Footer`                                                     |
| `@cloudensis/design-system/components/icon/check`          | `CheckIcon`                                                  |
| `@cloudensis/design-system/components/icon/copy`           | `CopyIcon`                                                   |
| `@cloudensis/design-system/components/icon/logo`           | `LogoIcon`                                                   |
| `@cloudensis/design-system/lib/highlight`                  | `highlight`（`CodeBlock` が使っている Shiki のハイライター） |
| `@cloudensis/design-system/lib/utils`                      | `cn`                                                         |

## 開発

| script                                                  | 内容                                               |
| ------------------------------------------------------- | -------------------------------------------------- |
| `npm run dev`                                           | ドキュメントサイトの開発サーバー                   |
| `npm run build`                                         | 配布物を `dist/` にビルド                          |
| `npm run build:docs`                                    | ドキュメントサイトをビルド                         |
| `npm run deploy:docs`                                   | ドキュメントサイトを Cloudflare Workers にデプロイ |
| `npm run lint` / `npm run format` / `npm run typecheck` | 静的チェック                                       |

## ドキュメントサイト

`docs/` はこのパッケージ自体を使ったドキュメントサイトで、Cloudflare Workers で配信します。favicon と OGP 画像は [cloudensis.com](https://cloudensis.com) と同じものを `public/` に置いて共用しています（`public/` は npm の配布物には含みません）。

`canonical` と OGP の絶対 URL はリクエストの URL から組み立てるため、デプロイ先のドメインをコードに持つ必要はありません。

## リリース

1. `package.json` の `version` を上げて main にマージする
2. GitHub で Release を作成する
3. `.github/workflows/publish.yaml` が npm への publish（Trusted Publishing による OIDC 認証のためトークンは不要）と、ドキュメントサイトの Cloudflare Workers へのデプロイを行う

ドキュメントサイトのデプロイには、リポジトリの Secrets に `CLOUDFLARE_API_TOKEN` と `CLOUDFLARE_ACCOUNT_ID` が必要です。
