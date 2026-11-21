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

### テーマ

既定はライトです。`html` 要素の `data-theme` で切り替えます。

```html
<html data-theme="dark">
  <!-- ダーク -->
</html>
<html data-theme="auto">
  <!-- OS の設定に従う -->
</html>
```

色は `light-dark()` で定義しているため、Safari 17.5 以降・Chrome 123 以降・Firefox 120 以降が必要です。

### トークン

| ファイル         | 内容                                                                         |
| ---------------- | ---------------------------------------------------------------------------- |
| `palette.css`    | プリミティブな色（`--color-neutral-*` など）。直接は使わない                 |
| `colors.css`     | セマンティックな色（`--text-color-default` など）。ライトとダークの値を持つ  |
| `typography.css` | フォント、本文（`--text-sm` など）と見出し（`--text-heading-*`）の文字サイズ |
| `sizes.css`      | 余白（`--space-*`）とコントロールの大きさ（`--control-height-*` など）       |
| `radius.css`     | 角丸（`--radius-*`）                                                         |

## 開発

| script                                                  | 内容                                                                         |
| ------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `npm run dev`                                           | ドキュメントサイトの開発サーバー                                             |
| `npm run build`                                         | 配布物を `dist/` にビルド（CSS Modules は `dist/components.css` にまとめる） |
| `npm run build:docs`                                    | ドキュメントサイトをビルドし、各ページを SSG で HTML に書き出す              |
| `npm test`                                              | ドキュメントサイトのルーターのテスト                                         |
| `npm run lint` / `npm run format` / `npm run typecheck` | 静的チェック                                                                 |
| `npm run test:a11y`                                     | ドキュメントサイトを axe で検査                                              |

## リリース

1. 変更を main にマージする（`package.json` の `version` は `0.0.0` のまま変えない）
2. 公開するバージョンのタグ（例: `0.12.0`）で GitHub の Release を作成する
3. npm への publish とドキュメントサイトのデプロイが自動で行われる

デプロイは [cf CLI](https://www.npmjs.com/package/cf) で Cloudflare Workers に行います（設定は `cloudflare.config.ts`）。Secrets の `CLOUDFLARE_API_TOKEN` と `CLOUDFLARE_ACCOUNT_ID` が必要です。
