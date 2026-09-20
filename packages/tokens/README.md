# @cloudensis/tokens

Cloudensis のデザイントークン。**CSS変数のみで、JavaScript を含みません。**
依存もありません。

> Cloudensis 社内のデザイントークンに基づくライブラリであり、社外での利用を推奨しません。
> MIT ライセンスで公開していますが、外部サポートは行いません。

```bash
npm install @cloudensis/tokens
```

```css
@import "@cloudensis/tokens/tokens.css";
```

サブパス付きで import してください。bare specifier + `exports` のルート指定だと、
バンドラによっては CSS として解決されない場合があります。

## トークン一覧

| 変数 | 用途 |
|---|---|
| `--cds-color-bg` / `--cds-color-bg-subtle` | 背景 |
| `--cds-color-fg` / `--cds-color-fg-muted` | 文字 |
| `--cds-color-accent` / `--cds-color-accent-hover` | アクセント・リンク |
| `--cds-color-border` / `--cds-color-border-subtle` | 罫線 |
| `--cds-color-success` / `--cds-color-warn` / `--cds-color-danger` / `--cds-color-info` | 状態色 |
| `--cds-color-code-fg` / `--cds-color-code-bg` | コード |
| `--cds-font-sans` / `--cds-font-mono` | フォントスタック |
| `--cds-radius-sm` / `--cds-radius-md` / `--cds-radius-lg` | 角丸 |
| `--cds-space-1` 〜 `--cds-space-12` | 余白スケール |
| `--cds-shadow-sm` / `--cds-shadow-md` | 影 |
| `--cds-color-scheme` | `color-scheme` の値（`light` / `dark`） |

`--cds-color-scheme` だけは実プロパティに繋がっています。`:root` に
`color-scheme: var(--cds-color-scheme)` を1行だけ出力しており、
これによりスクロールバーやフォーム部品がテーマに追随します。
追随させたくない場合は `--cds-color-scheme` を上書きしてください。
これがこのパッケージで唯一、カスタムプロパティ以外の宣言です。

## 上書き

主要な拡張ポイントです。レイヤ外に書けば必ず勝ちます。

```css
:root {
  --cds-color-accent: #0f766e;
}
```

## ダークモード

次の3系統すべてで切り替わり、**手動指定が OS 設定を必ず上書きします。**

```html
<html>                          <!-- OS 設定に従う -->
<html class="dark">             <!-- 明示的にダーク -->
<html data-theme="dark">        <!-- 明示的にダーク（属性） -->
<html class="light">            <!-- OS がダークでもライト -->
```

セレクタは `:root` に限定していないため、**祖先要素に付ければ部分的に切り替えられます。**

```html
<aside data-theme="dark">ここだけダーク</aside>
```

優先順位は詳細度ではなく**記述順**で担保しています。生成される CSS は4ブロックです。

```css
@layer cds.tokens {
  :root { /* 1. ライト（既定値） */ }

  @media (prefers-color-scheme: dark) {
    :root:not(.light):not([data-theme="light"]) { /* 2. OS がダーク、かつ明示的なライト指定がない */ }
  }

  .dark, [data-theme="dark"] { /* 3. 明示的なダーク */ }

  .light, [data-theme="light"] { /* 4. 明示的なライト。最後なので常に勝つ */ }
}
```

ライト値とダーク値がそれぞれ2回登場するため、**1つの定義から4ブロックを生成**しています。
値を変えるときは `src/tokens.mjs` の1か所だけを編集してください。
ライトとダークでキーが食い違うとビルドが失敗します。

## Tailwind CSS との橋渡し

`--cds-*` を Tailwind のテーマに繋ぐ場合は `@theme inline` を使ってください。
`inline` を付けないと参照が切れます。

```css
@theme inline {
  --color-accent: var(--cds-color-accent);
}
```

接頭辞 `--cds-` は必須です。省くと Tailwind のテーマ変数と正面衝突し、
デザイントークンが意図せず Tailwind ユーティリティの定義そのものになります。

## カスケードレイヤ

全ルールが `cds.tokens` レイヤに入っています。ファイル先頭で
`@layer cds.tokens, cds.prose, cds.ui;` を宣言しているため、
3枚の CSS をどの順で読み込んでも順序は同じに固定されます。

詳細は[ルートの README](https://github.com/cloudensis/design-system#readme) を参照してください。

## ライセンス

MIT
