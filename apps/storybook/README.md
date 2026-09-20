# @cloudensis/storybook

3パッケージのカタログ兼検証環境。**非公開**（`private: true`）で、npm には publish しません。
静的ビルドは `main` への push ごとに GitHub Pages へ配信されます。

```bash
npm run storybook          # ルートから。build → storybook dev
npm run storybook:build    # 静的ビルド
```

## HTML レンダラを使う理由

`hono/jsx` はサーバサイドで **HTML 文字列**を生成する JSX 実装であり、
Storybook に公式の hono/jsx レンダラは存在しません。

`@storybook/html-vite` なら story が HTML 文字列 / DOM 要素を返す契約なので、
**SSR の出力そのもの**をカタログ化でき、実際に publish される成果物と同じものを検証できます。
React レンダラへ無理に載せると shim が必要になり、検証している対象が本番と乖離します。

`hono/jsx/dom`（クライアント実装）は非目的なので使いません。

すべての story は `src/render.ts` の1つのヘルパを経由します。

## ビルド済み成果物を参照する

各パッケージの **`dist`** を参照します（`exports` 経由）。`src` を直接見ると、
`exports` の設定ミスやビルド時の CSS 変換の不具合を検出できません。
`storybook dev` の前に `npm run build` が走ります。

## ツールバー

### Theme

`light` / `dark` / `data-theme="dark"` / `class="dark"` を個別に試せます。

> [!IMPORTANT]
> **`prefers-color-scheme` は JS から偽装できません。**
> OS 設定由来の分岐（tokens の2番目のブロック）と、「手動指定が OS 設定を上書きする」ことの
> 確認は、ブラウザ DevTools のエミュレーション機能
> （Chrome: Rendering パネル → "Emulate CSS media feature prefers-color-scheme"）で
> 手動で行う必要があります。

### Tailwind

Preflight 込みの Tailwind をビルドした CSS（`public/tailwind-preflight.css`）を
`disabled` の切り替えで有効・無効にします。
prose がリセットの有無に依存しないことを、1つの Storybook 上で比較できます。

この CSS は生成物なので gitignore しています。`dev` / `build` の先頭で
`build:tailwind` を明示的に実行しており、暗黙の `pre` ライフサイクルフックには
依存していません（npm のバージョンや起動方法、`--ignore-scripts` に左右されないため）。

`public/` には `.gitkeep` を置いています。Storybook の `staticDirs` は対象ディレクトリが
存在しないとエラーで落ちるため、生成物しか入らないこのディレクトリを git に残す必要があります。
これが無いと、クローン直後に `storybook dev` が
`Failed to load static files, no such directory: ./public` で起動できません。

## レイヤ順

`.storybook/preview-head.html` の inline `<style>` が最初にレイヤ順を宣言します。
Tailwind バンドルを `<link>` として読み込むため、それより前に置く必要があるからです。

```css
@layer theme, base, cds.tokens, cds.prose, cds.ui, components, utilities;
```

`src/preview.css` は README に書く利用側の手順と同一の形にしてあります
（ドキュメントと実物が乖離しないため）。

## ダミーコンポーネント

`src/components/demo-widgets.tsx` の `DemoCallout`（パターン A）と
`DemoButton`（パターン B）は**このアプリ専用**です。`@cloudensis/ui` には入れません。
`.cds-*` と `.prose` が競合しないことの確認用です。

## story の一覧

| story | 検証内容 |
|---|---|
| `Tokens/Catalogue` | トークン一覧。値は computed style から読み出し |
| `Prose/Article` | 対応要素をすべて含む長文記事。サイズ4段階、`.prose-full` |
| `Prose/Elements` | リストのネストと `li > p`、横幅を超える表、日英混在と長い URL、インライン要素 |
| `Prose/Escape hatches` | `.not-prose`、レイヤ外 CSS による上書き、パターン A / B のコンポーネント |
| `Prose/Isolation` | tokens 無しでの単体動作、CSS の import 順非依存 |
| `Prose/Tailwind` | ユーティリティが `.prose` 内でも効くこと、レイヤが詳細度に勝つこと |
| `UI/*` | 4コンポーネント（autodocs 有効） |
