# GEMINI.md

## 目的
- Gemini CLI 向けのコンテキストと作業方針を定義する。

## 出力スタイル
- 言語: 日本語
- トーン: 簡潔で事実ベース
- 形式: Markdown

## 共通ルール
- 会話は日本語で行う。
- PR とコミットは Conventional Commits に従う。
- PR タイトルとコミット本文の言語: PR タイトルは Conventional Commits 形式（英語推奨）。PR 本文は日本語。コミットは Conventional Commits 形式（description は日本語）。
- 日本語と英数字の間には半角スペースを入れる。

## プロジェクト概要
Automatically translate GitHub Changelog RSS feed articles to Japanese and deliver translated content.

### 技術スタック
- **言語**: TypeScript
- **フレームワーク**: C, L, I, /, S, t, a, n, d, a, l, o, n, e
- **パッケージマネージャー**: pnpm
- **主要な依存関係**:
  - axios
  - fast-xml-parser
  - @book000/eslint-config
  - tsx
  - typescript

## コーディング規約
- フォーマット: 既存設定（ESLint / Prettier / formatter）に従う。
- 命名規則: 既存のコード規約に従う。
- コメント言語: 日本語
- エラーメッセージ: 英語

### 開発コマンド
```bash
# install
pnpm install

# dev
tsx watch ./src/main.ts

# start
tsx ./src/main.ts

# lint
run-z lint:prettier,lint:eslint,lint:tsc

# fix
run-z fix:prettier,fix:eslint

# lint:prettier
prettier --check src

# lint:eslint
eslint . -c eslint.config.mjs

# lint:tsc
tsc

# fix:eslint
eslint . -c eslint.config.mjs --fix

# fix:prettier
prettier --write src

```

## 注意事項
- 認証情報やトークンはコミットしない。
- ログに機密情報を出力しない。
- 既存のプロジェクトルールがある場合はそれを優先する。

## リポジトリ固有
- **node_version**: 20+ (.node-version)
- **package_manager**: pnpm@10.28.1
- **preinstall**: pnpm only (enforces pnpm usage)
- **license**: MIT
- **output**: Translated RSS feed published to GitHub Pages
- **rss_url**: https://book000.github.io/github-changelog-translator/changelog.xml
- **language_support**: Japanese translation only
- **source**: GitHub Changelog RSS (https://github.blog/changelog/)
- **special_tools**: run-z for task orchestration, tsx for TypeScript execution