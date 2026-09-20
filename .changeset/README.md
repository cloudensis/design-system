# Changesets

3パッケージを独立してバージョニングします。

変更を加えたら、その PR に changeset を1つ含めてください。

```bash
pnpm changeset
```

`main` にマージされると、`.github/workflows/release.yml` が
「Version Packages」PR を開きます。その PR をマージすると publish が走ります。

- publish は **CI からのみ**。個人端末から `npm publish` しないこと
- 認証は npm の Trusted Publishing（GitHub Actions の OIDC 連携）。長期トークンは置きません
- `release` ジョブは `npm` environment に紐づいています。
  リポジトリ設定で required reviewers を設定しておくと、publish 前に承認が挟まります
- npm のレジストリは不変です。一度公開した名前とバージョンの組み合わせは
  unpublish しても再利用できません。`pnpm check:pack` の出力を必ずレビューしてください

詳細は https://github.com/changesets/changesets
