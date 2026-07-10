# CLAUDE.md

Claude Code がこのプロジェクトで作業する際の方針とプロジェクト固有ルール。

## プロジェクト概要

- 目的: GitHub Blog Changelog の RSS フィードを翻訳して配信する
- 処理の流れ:
  1. GitHub Blog Changelog の RSS フィードを取得（ネイティブ `fetch`）
  2. `fast-xml-parser` で XML をパース
  3. Google Apps Script エンドポイント（`GAS_URL`）を呼び出してタイトルと本文を翻訳（英語→日本語）
  4. `fast-xml-builder` で XML を再構築し出力
  5. GitHub Actions で GitHub Pages にデプロイ
- 配信先: https://book000.github.io/github-changelog-translator/changelog.xml

## 開発コマンド

```bash
pnpm install       # 依存関係のインストール（pnpm 必須。npm/yarn は preinstall で拒否）
pnpm start         # RSS フィードの取得と翻訳を実行（tsx で src/main.ts を直接実行）
pnpm dev           # 開発モード（ファイル変更を監視して自動再実行）
pnpm lint          # Prettier + ESLint + tsc をまとめて実行
pnpm fix           # Prettier + ESLint の自動修正
pnpm lint:tsc      # TypeScript 型チェックのみ
```

`lint:prettier` / `lint:eslint` / `fix:prettier` / `fix:eslint` の個別コマンドも存在する。

## アーキテクチャと主要ファイル

- `src/main.ts`: 唯一のエントリーポイント。フィード取得・翻訳・XML 再構築・出力の全処理を含む単一ファイル構成のため、モジュール分割は不要
- `output/`: 生成された RSS フィード（`changelog.xml`）の出力先。`OUTPUT_CHANGELOG_PATH` で変更可能
- `dist/`: `tsc` 実行時のみ使用するコンパイル出力先（通常は tsx で直接実行するため未使用）
- `.github/workflows/nodejs-ci-pnpm.yml`: CI（`book000/templates` の再利用ワークフローを呼び出す）
- `.github/workflows/update-rss.yml`: 日次 RSS 更新（cron: UTC 0:00）と GitHub Pages デプロイ

## コーディング規約

- TypeScript strict モード。`skipLibCheck` を有効にして型エラーを回避することは禁止
- `any` 型の使用禁止、エラーの握りつぶし禁止
- 関数・インターフェースには JSDoc を日本語で記載・更新する
- コメント言語: 日本語 / エラーメッセージ言語: 英語
- 日本語と英数字の間には半角スペースを挿入する
- フォーマットは Prettier（`.prettierrc.yml`）、Lint は ESLint（`@book000/eslint-config`）で強制

## テスト

- テストフレームワークは未導入。品質保証は型チェック（`pnpm lint:tsc`）、ESLint、Prettier、GitHub Actions CI で実施
- 新機能追加時は `pnpm lint` が通ること（型チェック・ESLint・Prettier のすべて）を確認する

## 環境変数

- `GAS_URL`（必須）: 翻訳を行う Google Apps Script のエンドポイント URL
- `GITHUB_CHANGELOG_URL`（任意, 既定: `https://github.blog/changelog/feed/`）
- `BEFORE_LANGUAGE`（任意, 既定: `en`）
- `AFTER_LANGUAGE`（任意, 既定: `ja`）
- `OUTPUT_CHANGELOG_PATH`（任意, 既定: `output/changelog.xml`）

## ドキュメント更新ルール

- プロジェクト概要や使用方法を変更した場合は `README.md` を更新し、`README-ja.md` も同期させる
- 環境変数・RSS 出力形式・翻訳ロジックを変更した場合は本ファイルと README を見直す

## セキュリティ / 運用ルール

- `GAS_URL` などの機密情報を含むファイルをコミットしない。値をログに出力しない。機密は GitHub Actions の Secrets で管理する
- Renovate による依存関係の自動更新が設定されている。Renovate が作成した PR に追加コミットや更新を行ってはならない

## 会話・コミット規約

- 会話言語: 日本語
- コミット: [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) に従う（`<description>` は日本語）
- ブランチ: [Conventional Branch](https://conventional-branch.github.io) の短縮形（`feat`, `fix` など）
