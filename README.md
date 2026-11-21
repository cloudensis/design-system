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

## 対応ブラウザ

次のバージョン以降に対応します。`@scope`・CSS Nesting・`color-mix()`・`:has()` を使っているため、これより古いブラウザではスタイルが崩れます。

| ブラウザ             | バージョン |
| -------------------- | ---------- |
| Chrome / Edge        | 120        |
| Safari（iOS を含む） | 17.4       |
| Firefox              | 146        |

## バージョニング

[Semantic Versioning](https://semver.org/lang/ja/) に従います。ただし 0.x の間は、minor で破壊的変更を含むことがあります。patch は後方互換を保ちます。

公開 API は `package.json` の `exports` に載っているパスと、コンポーネントの props です。CSS Modules が作るクラス名（`_button_xxxxx_3` など）は patch でも変わるため、API ではありません。見た目は `class` で上書きしてください。

## リリース

1. 変更を main にマージする（`package.json` の `version` は `0.0.0` のまま変えない）
   - 利用側に影響する変更の PR には `breaking-change` ラベルを付ける
2. 公開するバージョンのタグ（例: `0.12.0`）で GitHub の Release を作成し、「Generate release notes」でリリースノートを作る（分類は `.github/release.yml`）
3. npm への publish とドキュメントサイトのデプロイが自動で行われる

- タグのコミットが main に含まれていないと publish しません。
- プレリリース（GitHub の「Set as a pre-release」、またはタグが `0.16.0-beta.1` のように `-` を含む）は npm の `next` タグで公開し、ドキュメントサイトはデプロイしません。`npm install @cloudensis/design-system@next` で試せます。

デプロイは [cf CLI](https://www.npmjs.com/package/cf) で Cloudflare Workers に行います（設定は `cloudflare.config.ts`）。Secrets の `CLOUDFLARE_API_TOKEN` と `CLOUDFLARE_ACCOUNT_ID` が必要です。
