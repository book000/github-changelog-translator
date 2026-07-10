# GitHub Copilot コードレビュー指示

このリポジトリのプルリクエストをレビューする際の指針。

## プロジェクト概要

GitHub Blog Changelog の RSS フィードを取得し、Google Apps Script（`GAS_URL`）で英語→日本語に翻訳して、翻訳済み RSS を GitHub Pages で配信するツール。処理は `src/main.ts` の単一ファイルに集約されている。

## 技術スタック

- 言語 / ランタイム: TypeScript（strict モード）+ Node.js、`tsx` で直接実行
- パッケージマネージャー: pnpm（`preinstall` で npm/yarn を拒否）
- HTTP: ネイティブ `fetch`（`axios` などの HTTP ライブラリは使用していない）
- XML: `fast-xml-parser`（パース）と `fast-xml-builder`（生成）
- Lint / Format: ESLint（`@book000/eslint-config`）+ Prettier

## レビュー観点

- **strict モード遵守**: `any` 型の追加や `skipLibCheck` による型エラー回避を指摘する
- **エラーハンドリング**: `fetch` の失敗・非 200 応答の扱いを確認する。既存実装はフィード取得失敗時に例外を投げ、翻訳 API が非 200 のとき `null` を返して当該項目をスキップする。この方針から外れる変更に注意
- **環境変数**: 新規の環境変数はデフォルト値の設定と必須チェックが適切か確認する。`GAS_URL` は必須で未設定時に例外を投げる
- **XML 処理**: `ignoreAttributes: false` など属性を保持する設定が維持されているか確認する
- **HTTP ライブラリの追加**: ネイティブ `fetch` で足りる処理に対して新たな HTTP クライアント依存を導入していないか確認する

## コーディング規約（レビュー時に確認）

- コメントは日本語、エラーメッセージは英語で記載する
- 関数・インターフェースには日本語の JSDoc を付与する
- 日本語と英数字の間には半角スペースを入れる
- Prettier / ESLint に準拠していること（フォーマットは自動修正で解消できるため、指摘は最小限でよい）

## セキュリティ

- `GAS_URL` などの機密情報をコード・ログ・コミットに含めていないか確認する。機密は GitHub Actions の Secrets で管理する

## フラグ不要な既知パターン

- テストコードが存在しないこと（本プロジェクトはテストフレームワーク未導入。品質保証は型チェック・ESLint・Prettier・CI で実施）
- 単一ファイル構成（`src/main.ts`）であること。モジュール分割は必須ではない
- 依存パッケージのバージョン更新 PR（Renovate による自動 PR）

## 言語

レビューコメントは日本語で記載する。コミットは Conventional Commits（`<description>` は日本語）に従う。
