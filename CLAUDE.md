# Claude Code 作業方針

## 目的

このドキュメントは、Claude Code がこのプロジェクトで作業を行う際の方針とプロジェクト固有ルールを示します。

## 判断記録のルール

判断は必ずレビュー可能な形で記録すること:

1. 判断内容の要約を記載する
2. 検討した代替案を列挙する
3. 採用しなかった案とその理由を明記する
4. 前提条件・仮定・不確実性を明示する
5. 他エージェントによるレビュー可否を示す

前提・仮定・不確実性を明示し、仮定を事実のように扱わない。

## プロジェクト概要

- 目的: GitHub Changelog の RSS フィードを翻訳して配信する
- 主な機能:
  - GitHub Blog Changelog の RSS フィード取得
  - Google Apps Script 経由でのタイトルと本文の翻訳（英語→日本語）
  - 翻訳済み RSS フィードの生成と GitHub Pages での公開
- 配信先: https://book000.github.io/github-changelog-translator/changelog.xml

## 重要ルール

- 会話言語: 日本語
- コミット規約: [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) に従う（`<description>` は日本語）
- コメント言語: 日本語
- エラーメッセージ言語: 英語
- 日本語と英数字の間: 半角スペースを挿入

## 環境のルール

- ブランチ命名: [Conventional Branch](https://conventional-branch.github.io) に従う（短縮形: feat, fix）
- GitHub リポジトリ調査: テンポラリディレクトリに git clone してコード検索
- Renovate PR の扱い: Renovate が作成した既存のプルリクエストに対して、追加コミットや更新を行ってはならない
- Git Worktree: このプロジェクトでは使用していない

## コード改修時のルール

- 日本語と英数字の間には、半角スペースを挿入しなければならない
- TypeScript プロジェクトにおいて、`skipLibCheck` を有効にして回避することは絶対にしてはならない
- 関数やインターフェースには、docstring (JSDoc など) を記載・更新してください。日本語で記載する必要がある

## 相談ルール

Codex CLI や Gemini CLI の他エージェントに相談することができます。以下の観点で使い分けてください。

- **Codex CLI (ask-codex)**:
  - 実装コードに対するソースコードレビュー
  - 関数設計、モジュール内部の実装方針などの局所的な技術判断
  - アーキテクチャ、モジュール間契約、パフォーマンス/セキュリティといった全体影響の判断
  - 実装の正当性確認、機械的ミスの検出、既存コードとの整合性確認

- **Gemini CLI (ask-gemini)**:
  - SaaS 仕様、言語・ランタイムのバージョン差、料金・制限・クォータといった、最新の適切な情報が必要な外部依存の判断
  - 外部一次情報の確認、最新仕様の調査、外部前提条件の検証

他エージェントが指摘・異議を提示した場合、Claude Code は必ず以下のいずれかを行う。黙殺・無言での不採用は禁止する。

- 指摘を受け入れ、判断を修正する
- 指摘を退け、その理由を明示する

以下は必ず実施してください:

- 他エージェントの提案を鵜呑みにせず、その根拠や理由を理解する
- 自身の分析結果と他エージェントの意見が異なる場合は、双方の視点を比較検討する
- 最終的な判断は、両者の意見を総合的に評価した上で、自身で下す

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

## アーキテクチャと主要ファイル

### アーキテクチャサマリー

このプロジェクトは、シンプルな単一目的ユーティリティです:

1. GitHub Blog Changelog の RSS フィードを取得
2. fast-xml-parser で XML をパース
3. Google Apps Script エンドポイントを呼び出して翻訳
4. 翻訳されたコンテンツで XML を再構築
5. `output/changelog.xml` に書き込み
6. GitHub Actions で GitHub Pages にデプロイ

### 主要ディレクトリ

```
github-changelog-translator/
├── src/
│   └── main.ts                 # メインロジック（エントリーポイント）
├── output/                     # 生成された RSS フィードの出力先
├── .github/
│   └── workflows/              # GitHub Actions ワークフロー
│       ├── nodejs-ci-pnpm.yml  # CI/CD パイプライン
│       └── update-rss.yml      # 日次 RSS 更新ワークフロー
└── dist/                       # コンパイル出力（生成）
```

## 実装パターン

### 推奨パターン

- **TypeScript strict モード**: 型安全性を最大限に活用
- **環境変数**: process.env から取得し、デフォルト値を設定
- **エラーハンドリング**: 適切な try-catch とエラーメッセージ
- **XML 処理**: fast-xml-parser の属性ハンドリング機能を活用

### 非推奨パターン

- `any` 型の使用（strict モードに反する）
- `skipLibCheck` の有効化
- エラーの無視や握りつぶし

## テスト

### テスト方針

- テストフレームワークは未導入
- 品質保証は以下で実施:
  - TypeScript strict モードによる型チェック
  - ESLint による静的解析
  - Prettier によるコードフォーマット
  - GitHub Actions CI/CD による検証

### 追加テスト条件

新機能を追加する場合、以下を満たすこと:

- TypeScript の型チェックが通ること
- ESLint のエラーがないこと
- Prettier のフォーマットに準拠すること

## ドキュメント更新ルール

### 更新対象

コード変更時に以下のドキュメントを更新する必要がある場合は更新すること:

- `README.md`: プロジェクト概要、使用方法の変更時
- `README-ja.md`: README.md と同期して更新

### 更新タイミング

- 環境変数の追加・変更時
- RSS フィードの出力形式変更時
- 翻訳処理のロジック変更時

## 作業チェックリスト

### 新規改修時

新規改修を行う前に、以下を必ず確認しなければなりません:

1. プロジェクトについて詳細に探索し理解すること
2. 作業を行うブランチが適切であること。すでに PR を提出しクローズされたブランチでないこと
3. 最新のリモートブランチに基づいた新規ブランチであること
4. PR がクローズされ、不要となったブランチは削除されていること
5. プロジェクトで指定されたパッケージマネージャ（pnpm）により、依存パッケージをインストールしたこと

### コミット・プッシュ前

コミット・プッシュする前に、以下を必ず確認しなければなりません:

1. コミットメッセージが [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) に従っていること。ただし、`<description>` は日本語で記載します
2. コミット内容にセンシティブな情報が含まれていないこと
3. Lint / Format エラーが発生しないこと
4. 動作確認を行い、期待通り動作すること

### プルリクエスト作成前

プルリクエストを作成する前に、以下を必ず確認しなければなりません:

1. プルリクエストの作成をユーザーから依頼されていること
2. コミット内容にセンシティブな情報が含まれていないこと
3. コンフリクトする恐れが無いこと

### プルリクエスト作成後

プルリクエストを作成したあとは、以下を必ず実施しなければなりません。PR 作成後のプッシュ時に毎回実施してください:

1. コンフリクトが発生していないこと
2. PR 本文の内容は、ブランチの現在の状態を、今までのこの PR での更新履歴を含むことなく、最新の状態のみ、漏れなく日本語で記載されていること。この PR を見たユーザーが、最終的にどのような変更を含む PR なのかをわかりやすく、細かく記載されていること
3. `gh pr checks <PR ID> --watch` で GitHub Actions CI を待ち、その結果がエラーとなっていないこと。成功している場合でも、ログを確認し、誤って成功扱いになっていないこと。もし GitHub Actions が動作しない場合は、ローカルで CI と同等のテストを行い、CI が成功することを保証しなければならない
4. `request-review-copilot` コマンドが存在する場合、`request-review-copilot https://github.com/$OWNER/$REPO/pull/$PR_NUMBER` で GitHub Copilot へレビューを依頼すること。レビュー依頼は自動で行われる場合もあるし、制約により `request-review-copilot` を実行しても GitHub Copilot がレビューしないケースがある
5. 10 分以内に投稿される GitHub Copilot レビューへの対応を行うこと。対応したら、レビューコメントそれぞれに対して返信を行うこと。レビュアーに GitHub Copilot がアサインされていない場合はスキップして構わない
6. `/code-review:code-review` によるコードレビューを実施したこと。コードレビュー内容に対しては、**スコアが 50 以上の指摘事項** に対して対応してください（80 がボーダーラインではありません）

## リポジトリ固有

- このプロジェクトは GitHub Pages にデプロイされる
- 翻訳処理は外部の Google Apps Script エンドポイントを呼び出す
- 環境変数:
  - `GAS_URL` (必須): Google Apps Script のエンドポイント URL
  - `GITHUB_CHANGELOG_URL` (オプション, デフォルト: https://github.blog/changelog/feed/)
  - `BEFORE_LANGUAGE` (オプション, デフォルト: 'en')
  - `AFTER_LANGUAGE` (オプション, デフォルト: 'ja')
  - `OUTPUT_CHANGELOG_PATH` (オプション, デフォルト: 'output/changelog.xml')
- GitHub Actions による日次自動実行（UTC 0:00）がスケジュールされている
- 単一ファイル構成（`src/main.ts`）のため、モジュール分割は不要
- Renovate による依存関係の自動更新が設定されている。Renovate が作成した PR に追加コミットや更新を行ってはならない
