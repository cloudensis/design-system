# Changesets

3パッケージを独立してバージョニングします。

## 変更を記録する

パッケージに変更を加えた PR には、changeset を1つ含めてください。

```bash
npm run changeset
```

## リリースする

publish は **`main` への push では走りません。** GitHub Release を publish した
ときだけ `.github/workflows/release.yml` が動きます。リリースを切るのが、日付の
残る明示的な行為になり、タグが npm に出たコミットを正確に指します。

1. リリースするタイミングでブランチを切り、バージョンを上げる

   ```bash
   npm run version-packages
   ```

   changeset を消費してバージョンを上げ、CHANGELOG を書き、`package-lock.json`
   を更新します。これをコミットして `main` にマージします。

2. そのコミットを指すタグで **GitHub Release を publish** する

`changeset publish` が、3パッケージのうちレジストリにまだ無いバージョンのものだけを
publish します。リポジトリ単位のタグ1本で、独立バージョニングされた3パッケージを
扱えます。

## 歯止め

- publish は **CI からのみ**。個人端末から `npm publish` しないこと
  （ルートの `.npmrc` に `provenance=true` があるため、手元からの publish は失敗します）
- 認証は npm の Trusted Publishing（GitHub Actions の OIDC 連携）。長期トークンは置きません
- `publish` ジョブは `npm` environment に紐づいています。
  リポジトリ設定で required reviewers を設定しておくと、publish 前に承認が挟まります
- `scripts/check-release-ready.mjs` が、未適用の changeset が残ったままのタグでの
  publish を拒否します。バージョンを上げ忘れたタグだと `changeset publish` は
  「何も publish せず成功」してしまい、リリースできたように見えるためです
- npm のレジストリは不変です。一度公開した名前とバージョンの組み合わせは
  unpublish しても再利用できません。`npm run check:pack` の出力を必ずレビューしてください

詳細は https://github.com/changesets/changesets
