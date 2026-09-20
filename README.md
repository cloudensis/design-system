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

フォント・トークン・記事用スタイルの定義に加えて、コンポーネントが使用しているクラスの収集設定（`@source`）もこのファイルに含まれているため、利用側での追加設定は不要です。

## フォント

欧文に [Outfit](https://fonts.google.com/specimen/Outfit)、和文に [Noto Sans JP](https://fonts.google.com/noto/specimen/Noto+Sans+JP) を使用します。webfont は Fontsource の可変フォントを依存に含めており、`index.css` を読み込むだけで同一オリジンから配信されます（外部 CDN への接続は発生しません）。woff2 は `unicode-range` で分割されているため、ブラウザは表示に必要なスライスだけを取得します。

フォントの指定は `--font-sans` トークン 1 つにまとまっています。

```css
--font-sans: "Outfit Variable", "Noto Sans JP Variable", ui-sans-serif, system-ui, sans-serif;
```

Tailwind CSS v4 は `--default-font-family` として `--font-sans` を参照するため、この定義だけで既定のフォントに反映されます。欧文・数字は Outfit で描画され、Outfit が字形を持たない和文は Noto Sans JP に落ちます。

webfont を利用側で読み込みたい場合（`next/font` を使う、フォントを差し替えるなど）は、`index.css` の代わりに `tokens.css` と `prose.css` を個別に読み込み、`@source` を自分で指定してください。

## 使い方

```tsx
import { Button, LinkButton } from "@cloudensis/design-system/components/ui/button";
import { Input } from "@cloudensis/design-system/components/ui/input";
import { Select } from "@cloudensis/design-system/components/ui/select";
import { Textarea } from "@cloudensis/design-system/components/ui/textarea";

<Input id="email" name="email" type="email" required />
<Select name="type">
	<option value="">選択してください</option>
</Select>
<Textarea name="message" rows={4} />
<Button type="submit">送信</Button>
<LinkButton href="/">リンク</LinkButton>
```

記事本文には `.prose` を付与します。

```tsx
<article class="prose">...</article>
```

## エントリ一覧

| import | 内容 |
| --- | --- |
| `@cloudensis/design-system/index.css` | 下記をまとめたエントリ（通常はこれを読み込む） |
| `@cloudensis/design-system/fonts.css` | Outfit / Noto Sans JP の `@font-face` 定義 |
| `@cloudensis/design-system/tokens.css` | `@theme` によるトークン定義 |
| `@cloudensis/design-system/prose.css` | 記事本文用のスタイル |
| `@cloudensis/design-system/components/ui/button` | `Button` / `LinkButton` |
| `@cloudensis/design-system/components/ui/input` | `Input`（`type` に応じてチェックボックス・ラジオにも対応） |
| `@cloudensis/design-system/components/ui/select` | `Select` |
| `@cloudensis/design-system/components/ui/textarea` | `Textarea` |
| `@cloudensis/design-system/components/ui/description-list` | `DescriptionList` |
| `@cloudensis/design-system/components/layout/section` | `Section` |
| `@cloudensis/design-system/lib/utils` | `cn` |

## 開発

| script | 内容 |
| --- | --- |
| `npm run dev` | ドキュメントサイトの開発サーバー |
| `npm run build` | 配布物を `dist/` にビルド |
| `npm run build:docs` | ドキュメントサイトをビルド |
| `npm run deploy:docs` | ドキュメントサイトを Cloudflare Workers にデプロイ |
| `npm run lint` / `npm run format` / `npm run typecheck` | 静的チェック |

## リリース

1. `package.json` の `version` を上げて main にマージする
2. GitHub で Release を作成する
3. `.github/workflows/publish.yaml` が npm に publish する（Trusted Publishing による OIDC 認証のためトークンは不要）
