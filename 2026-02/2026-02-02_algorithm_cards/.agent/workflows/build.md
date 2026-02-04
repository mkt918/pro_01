---
description: プロダクションビルドを実行する
---

# プロダクションビルド

このワークフローは、アプリケーションをプロダクション環境向けにビルドします。

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

1. ビルド結果を確認

```bash
npm run preview
```

## 出力

- ビルドされたファイルは `dist/` ディレクトリに出力されます
- 最適化された JavaScript と CSS が生成されます
- 本番環境にデプロイする際は、`dist/` ディレクトリの内容をアップロードしてください

## ビルド内容

- コードの最小化（Minification）
- Tree Shaking による不要コードの削除
- CSS の最適化
- アセットのハッシュ化
