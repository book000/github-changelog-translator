# GitHub Copilot Instructions

## プロジェクト概要

- 目的: GitHub Changelog の RSS フィードを翻訳して配信する
- 主な機能:
  - GitHub Blog Changelog の RSS フィード取得
  - Google Apps Script 経由でのタイトルと本文の翻訳（英語→日本語）
  - 翻訳済み RSS フィードの生成と GitHub Pages での公開
- 対象ユーザー: GitHub Changelog を日本語で読みたいユーザー
- 配信先: https://book000.github.io/github-changelog-translator/changelog.xml

## 共通ルール

- 会話は日本語で行う。
- コミットメッセージは [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) に従う。`<description>` は日本語で記載する。
  - 例: `feat: ユーザー認証機能を追加`
- ブランチ命名は [Conventional Branch](https://conventional-branch.github.io) に従う。`<type>` は短縮形（feat, fix）を使用する。
  - 例: `feat/add-user-auth`
- 日本語と英数字の間には半角スペースを入れる。

## 技術スタック

- 言語: TypeScript 5.9.3
- ランタイム: Node.js 24.13.0
- パッケージマネージャー: pnpm 10.28.1
- HTTP クライアント: axios 1.13.2
- XML パーサー: fast-xml-parser 5.3.3
- TypeScript 実行: tsx 4.21.0
- ビルドターゲット: CommonJS (es2020)

## コーディング規約

- フォーマッター: Prettier 3.8.1
  - 行幅: 80 文字
  - インデント: 2 スペース
  - 改行コード: LF
  - クォート: シングルクォート
  - トレイリングカンマ: あり
- リンター: ESLint 9.39.2 + @book000/eslint-config 1.12.40
- TypeScript: strict モード有効
  - `skipLibCheck` での回避は禁止
- パスエイリアス: `@/*` は `src/*` にマッピング
- コメント: 日本語で記載
- エラーメッセージ: 英語で記載
- 関数・インターフェースには JSDoc を日本語で記載

## 開発コマンド

```bash
# 依存関係のインストール
pnpm install

# RSS フィードの取得と翻訳を実行
pnpm start

# 開発モード（ファイル変更を監視して自動再実行）
pnpm dev

# Lint チェック（Prettier, ESLint, TypeScript）
pnpm lint

# Lint 自動修正（Prettier, ESLint）
pnpm fix

# Prettier チェックのみ
pnpm lint:prettier

# ESLint チェックのみ
pnpm lint:eslint

# TypeScript 型チェックのみ
pnpm lint:tsc

# Prettier 自動修正
pnpm fix:prettier

# ESLint 自動修正
pnpm fix:eslint
```

## テスト方針

- テストフレームワークは未導入
- 品質保証は以下で実施:
  - TypeScript strict モードによる型チェック
  - ESLint による静的解析
  - Prettier によるコードフォーマット
  - GitHub Actions CI/CD による検証

## セキュリティ / 機密情報

- `GAS_URL` などの環境変数を含むファイルは Git にコミットしない。
- ログに個人情報や認証情報を出力しない。
- GitHub Actions の Secrets で環境変数を管理する。

## ドキュメント更新

コード変更時に以下のドキュメントを更新する必要がある場合は更新すること:

- `README.md`: プロジェクト概要、使用方法の変更時
- `README-ja.md`: README.md と同期して更新

## リポジトリ固有

- このプロジェクトは GitHub Pages にデプロイされる。
- 翻訳処理は外部の Google Apps Script エンドポイントを呼び出す。
- 環境変数:
  - `GAS_URL` (必須): Google Apps Script のエンドポイント URL
  - `GITHUB_CHANGELOG_URL` (オプション, デフォルト: https://github.blog/changelog/feed/)
  - `BEFORE_LANGUAGE` (オプション, デフォルト: 'en')
  - `AFTER_LANGUAGE` (オプション, デフォルト: 'ja')
  - `OUTPUT_CHANGELOG_PATH` (オプション, デフォルト: 'output/changelog.xml')
- GitHub Actions による日次自動実行（UTC 0:00）がスケジュールされている。
- Renovate による依存関係の自動更新が設定されている。Renovate が作成した PR に追加コミットや更新を行ってはならない。
