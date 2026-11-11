# AGENTS.md

AI コーディングエージェントとコントリビューター向けの指針です。`CLAUDE.md` はこのファイルを取り込み、`.github/copilot-instructions.md` はレビュー観点を補足します。

## Language

- すべての成果物は**日本語**で書く。対象はコミットメッセージの description、PR / Issue のタイトルと本文、レビューコメント、コードコメントと JSDoc、ドキュメント（`README.md`、`AGENTS.md` など）。
- 日本語と英数字の間には半角スペースを入れる。
- 例外（そのまま維持する）: 引用、技術的な識別子、生成ファイル、外部ソースのテキスト、`package.json` の文章（英語）、`.github/copilot-instructions.md`（英語。日本語で書く旨の要約を含む）。
- 実行時メッセージ（ログ、エラー）は英語。
- 過去のコミットの言語を変えるために Git 履歴を書き換えない。
- 配信する翻訳済み RSS の内容は本ツールの成果物であり、この規則の対象外。

## Overview

GitHub Blog Changelog の RSS フィードを取得し、Google Apps Script（`GAS_URL`）でタイトルと本文を英語から日本語に翻訳して、翻訳済み RSS を GitHub Pages で配信するツール。

処理の流れ（すべて `src/main.ts`）:

1. ネイティブ `fetch` で RSS を取得し、`fast-xml-parser` でパースする。
2. 各 item のタイトルと `content:encoded` を `GAS_URL` に POST して翻訳する。翻訳に失敗した場合（非 200、通信エラー、不正な JSON、空の結果）は、その項目の原文を維持して警告を出す。
3. `fast-xml-builder` で XML を再構築し、`OUTPUT_CHANGELOG_PATH` に書き出す。

配信先: https://book000.github.io/github-changelog-translator/changelog.xml

## Commands

```bash
pnpm install   # 依存関係のインストール（pnpm 必須。preinstall で npm / yarn を拒否）
pnpm start     # 翻訳を実行して output/changelog.xml を生成（GAS_URL が必須）
pnpm dev       # ファイル変更を監視して再実行
pnpm lint      # Prettier + ESLint + tsc を実行
pnpm fix       # Prettier + ESLint の自動修正
```

個別コマンドとして `lint:prettier` / `lint:eslint` / `lint:tsc` / `fix:prettier` / `fix:eslint` もある。Node.js は `.node-version`、pnpm は `package.json` の `packageManager` で固定している。テストフレームワークは導入しておらず、品質は `pnpm lint` と CI で担保する。

## Structure

- `src/main.ts`: 唯一のエントリーポイント。取得、翻訳、XML 再構築、出力をすべて含む。単一ファイル構成のためモジュール分割は不要。
- `patches/`: `pnpm-workspace.yaml` の `patchedDependencies` で適用する `fast-xml-builder` の型定義パッチ。
- `output/`: 生成された `changelog.xml` の出力先（`OUTPUT_CHANGELOG_PATH` で変更可能）。
- `.github/workflows/nodejs-ci-pnpm.yml`: CI。`book000/templates` の再利用ワークフローを呼び出す。
- `.github/workflows/update-rss.yml`: 毎日 UTC 0:00（手動実行も可）に `pnpm start` を実行し、`output/` を GitHub Pages にデプロイする。

## Environment variables

- `GAS_URL`（必須）: 翻訳を行う Google Apps Script のエンドポイント URL。未設定の場合は例外を投げる。
- `GITHUB_CHANGELOG_URL`（任意、既定: `https://github.blog/changelog/feed/`）
- `BEFORE_LANGUAGE`（任意、既定: `en`）
- `AFTER_LANGUAGE`（任意、既定: `ja`）
- `OUTPUT_CHANGELOG_PATH`（任意、既定: `output/changelog.xml`）

## Conventions

- TypeScript strict モード。`any` の使用、エラーの握りつぶし、`skipLibCheck` による型エラー回避は禁止。
- 関数とインターフェースには JSDoc を付ける。
- XML のパースと生成では `ignoreAttributes: false` を維持する（属性を保持するため）。
- HTTP クライアントのライブラリは追加せず、ネイティブ `fetch` を使う。
- フォーマットは Prettier（`.prettierrc.yml`）、Lint は ESLint（`@book000/eslint-config`）で強制する。
- `README.md` の内容（概要、配信 URL）を変える変更では README も更新する。
- コミットは [Conventional Commits](https://www.conventionalcommits.org/)、ブランチは [Conventional Branch](https://conventional-branch.github.io) の短縮形（`feat`、`fix`、`docs` など）に従う。

## Safety

- `GAS_URL` などの機密情報をコミットしない。値をログに出力しない。機密は GitHub Actions の Secrets で管理する。
- Renovate が作成した PR にコミットを追加しない。
