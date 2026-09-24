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

## 使い方

```tsx
import { Button } from "@cloudensis/design-system/components/ui/button";

<Button type="submit">送信</Button>
```

記事本文には `.prose` を付与します。

```tsx
<article class="prose">...</article>
```

## ドキュメント

トークン・既定のスタイル・フォント・記事スタイル・各コンポーネントの仕様と、エントリ一覧は[ドキュメントサイト](https://design-system.cloudensis.com/)にまとめています。このリポジトリの `docs/` がそのソースで、`npm run dev` で手元でも確認できます。

## 開発

| script                                                  | 内容                                               |
| ------------------------------------------------------- | -------------------------------------------------- |
| `npm run dev`                                           | ドキュメントサイトの開発サーバー                   |
| `npm run build`                                         | 配布物を `dist/` にビルド                          |
| `npm run build:docs`                                    | ドキュメントサイトをビルド                         |
| `npm run deploy:docs`                                   | ドキュメントサイトを Cloudflare Workers にデプロイ |
| `npm run lint` / `npm run format` / `npm run typecheck` | 静的チェック                                       |

## ドキュメントサイト

`docs/` はこのパッケージ自体を使ったドキュメントサイトで、Cloudflare Workers で配信します。トークンやコンポーネントの仕様など利用者向けの説明はドキュメントサイトを正とし、README には導入手順だけを書きます。仕様を変えたときは `docs/` を更新してください。favicon と OGP 画像は [cloudensis.com](https://cloudensis.com) と同じものを `public/` に置いて共用しています（`public/` は npm の配布物には含みません）。

`canonical` と OGP の絶対 URL はリクエストの URL から組み立てるため、デプロイ先のドメインをコードに持つ必要はありません。

## リリース

1. `package.json` の `version` を上げて main にマージする
2. GitHub で Release を作成する（タグは `version` と同じ値にする。例: `0.10.0`。一致しない場合、publish とデプロイは行われません）
3. `.github/workflows/publish.yaml` が npm への publish（Trusted Publishing による OIDC 認証のためトークンは不要）と、ドキュメントサイトの Cloudflare Workers へのデプロイを行う

ドキュメントサイトのデプロイには、リポジトリの Secrets に `CLOUDFLARE_API_TOKEN` と `CLOUDFLARE_ACCOUNT_ID` が必要です。
