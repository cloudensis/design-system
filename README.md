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
| `npm run check:package`                                 | `npm pack` した配布物を利用側の形で import し、exports と型定義を検証        |

## 公開 API

`package.json` の `exports` に載っているパスと、コンポーネントの props が公開 API です。

- `components/*`・`icons/*`・`brand/*`・`lib/*` は、`src` のファイルと同じパスで import できます
- CSS Modules のクラス名の対応表（`*.module`）は公開しません。クラス名はファイルの内容から作るハッシュで、patch でも変わります。見た目は `class` で上書きしてください
- `index.css` はビルドした `dist/components.css` を相対パスで読み込みます。`src/styles` と `dist` の配置を変えるときは注意してください（`npm run check:package` で検出します）

## リリース

1. 変更を main にマージする（`package.json` の `version` は `0.0.0` のまま変えない）
2. 公開するバージョンのタグ（例: `0.12.0`）で GitHub の Release を作成する
3. npm への publish とドキュメントサイトのデプロイが自動で行われる

デプロイは [cf CLI](https://www.npmjs.com/package/cf) で Cloudflare Workers に行います（設定は `cloudflare.config.ts`）。Secrets の `CLOUDFLARE_API_TOKEN` と `CLOUDFLARE_ACCOUNT_ID` が必要です。
