# @cloudensis/design-system

cloudensis の CSS トークン・記事用スタイル・Hono JSX コンポーネント。

仕様は[ドキュメントサイト](https://design-system.cloudensis.com/)を参照してください。

## 導入

Tailwind CSS v4 と Hono v4 が必要です。

```sh
npm install @cloudensis/design-system
```

```css
@import "tailwindcss";
@import "@cloudensis/design-system/index.css";
```

```tsx
import { Button } from "@cloudensis/design-system/components/ui/button";
```

## 開発

| script                                                  | 内容                             |
| ------------------------------------------------------- | -------------------------------- |
| `npm run dev`                                           | ドキュメントサイトの開発サーバー |
| `npm run build`                                         | 配布物を `dist/` にビルド        |
| `npm run build:docs`                                    | ドキュメントサイトをビルド       |
| `npm run deploy:docs`                                   | ドキュメントサイトをデプロイ     |
| `npm run lint` / `npm run format` / `npm run typecheck` | 静的チェック                     |
| `npm run test:a11y`                                     | ドキュメントサイトを axe で検査  |

- 仕様を変えたら `docs/` を更新する。README には導入手順だけを書く。
- `src/components/` 以下はすべて公開 API になる。内部用の部品は外に置く。

## リリース

1. `package.json` の `version` を上げて main にマージする
2. `version` と同じタグ（例: `0.11.0`）で GitHub の Release を作成する
3. npm への publish とドキュメントサイトのデプロイが自動で行われる

デプロイには Secrets の `CLOUDFLARE_API_TOKEN` と `CLOUDFLARE_ACCOUNT_ID` が必要です。
