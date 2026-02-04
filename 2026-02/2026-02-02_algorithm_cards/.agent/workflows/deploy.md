---
description: GitHub Pages にデプロイする
---

# GitHub Pages へのデプロイ

このワークフローは、アプリケーションを GitHub Pages にデプロイします。

## 前提条件

- GitHub リポジトリが作成されていること
- リポジトリの Settings > Pages で GitHub Pages が有効化されていること

## 手順

// turbo

1. プロジェクトディレクトリに移動

```bash
cd c:\Program2\T\pro_01\2026-02\2026-02-02_algorithm_cards
```

// turbo
2. ビルドを実行

```bash
npm run build
```

1. `dist/` ディレクトリを GitHub Pages ブランチにプッシュ

```bash
git add dist -f
git commit -m "Deploy to GitHub Pages"
git subtree push --prefix dist origin gh-pages
```

または、GitHub Actions を使用した自動デプロイを設定することもできます。

## GitHub Actions による自動デプロイ（推奨）

`.github/workflows/deploy.yml` を作成：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## 確認

デプロイ後、以下の URL でアクセスできます：

```
https://<username>.github.io/<repository-name>/
```
