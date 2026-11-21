# @cloudensis/design-system

cloudensis の CSS トークン・記事用スタイル・Hono JSX コンポーネント。

仕様は[ドキュメントサイト](https://design-system.cloudensis.com/)を参照してください。

## 導入

Hono v4 が必要です。

```sh
npm install @cloudensis/design-system
```

```css
@import "@cloudensis/design-system/index.css";
```

```tsx
import { Button } from "@cloudensis/design-system/components/button";
```

## 開発

| script                                                  | 内容                                                                         |
| ------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `npm run dev`                                           | ドキュメントサイトの開発サーバー                                             |
| `npm run build`                                         | 配布物を `dist/` にビルド（CSS Modules は `dist/components.css` にまとめる） |
| `npm run build:docs`                                    | ドキュメントサイトをビルドし、各ページを SSG で HTML に書き出す              |
| `npm test`                                              | ドキュメントサイトのルーターのテスト                                         |
| `npm run lint` / `npm run format` / `npm run typecheck` | 静的チェック                                                                 |
| `npm run test:a11y`                                     | ドキュメントサイトを axe で検査                                              |

### ドキュメントサイト

`docs/` は [@cloudensis/create-hono](https://github.com/cloudensis/create-hono) のテンプレートと同じ構成です。

- `docs/index.tsx`: アプリのエントリーポイント
- `docs/renderer.tsx`: レイアウトと `<head>`
- `docs/routes` 以下の `index.ts` / `index.tsx` がルートになります（例: `routes/components/button/index.tsx` → `/components/button`）。HTTP メソッド名でハンドラーを export し、`ssg = true` を export すると `npm run build:docs` で HTML に書き出します
- ページを増やしたら、サイドメニューの `docs/nav.ts` にも追加します（アクセシビリティのテストもこの一覧を使います）

ビルドの設定は、ドキュメントサイトが `vite.config.ts`、配布物が `vite.lib.config.ts` です。

## リリース

1. `package.json` の `version` を上げて main にマージする
2. `version` と同じタグ（例: `0.12.0`）で GitHub の Release を作成する
3. npm への publish とドキュメントサイトのデプロイが自動で行われる

デプロイは [cf CLI](https://www.npmjs.com/package/cf) で Cloudflare Workers に行います（設定は `cloudflare.config.ts`）。Secrets の `CLOUDFLARE_API_TOKEN` と `CLOUDFLARE_ACCOUNT_ID` が必要です。
