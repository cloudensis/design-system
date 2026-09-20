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

トークンと記事用スタイルの定義に加えて、コンポーネントが使用しているクラスの収集設定（`@source`）もこのファイルに含まれているため、利用側での追加設定は不要です。

## 使い方

```tsx
import { Button, LinkButton } from "@cloudensis/design-system/components/ui/button";

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
| `@cloudensis/design-system/tokens.css` | `@theme` によるトークン定義 |
| `@cloudensis/design-system/prose.css` | 記事本文用のスタイル |
| `@cloudensis/design-system/components/ui/button` | `Button` / `LinkButton` |
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
