# @cloudensis/design-system

cloudensis の CSS トークン・記事用スタイル・Hono JSX コンポーネント。

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
import { Button } from "@cloudensis/design-system/components/button";
```

## 開発

| script                                                  | 内容                      |
| ------------------------------------------------------- | ------------------------- |
| `npm run build`                                         | 配布物を `dist/` にビルド |
| `npm run lint` / `npm run format` / `npm run typecheck` | 静的チェック              |

## リリース

1. `package.json` の `version` を上げて main にマージする
2. `version` と同じタグ（例: `0.12.0`）で GitHub の Release を作成する
3. npm への publish が自動で行われる
