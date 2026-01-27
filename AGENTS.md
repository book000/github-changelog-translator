# AI エージェント共通作業方針

## 目的

このドキュメントは、一般的な AI エージェントがこのプロジェクトで作業を行う際の共通作業方針を定義します。

## 基本方針

- **会話言語**: 日本語
- **コメント言語**: 日本語
- **エラーメッセージ言語**: 英語
- **日本語と英数字の間**: 半角スペースを挿入
- **コミット規約**: [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) に従う
  - `<type>(<scope>): <description>` 形式
  - `<description>` は日本語で記載
  - 例: `feat: ユーザー認証機能を追加`

## 判断記録のルール

判断は必ずレビュー可能な形で記録すること:

1. **判断内容の要約**: 何を決定したかを明確に記載
2. **検討した代替案**: 他にどのような選択肢があったかを列挙
3. **採用しなかった案とその理由**: なぜその選択肢を選ばなかったかを説明
4. **前提条件・仮定・不確実性**: 判断の前提となる条件や不確実な要素を明示
5. **他エージェントによるレビュー可否**: この判断が他のエージェントによってレビュー可能かを示す

**重要**: 前提・仮定・不確実性を明示し、仮定を事実のように扱わない。

## プロジェクト概要

- **目的**: GitHub Changelog の RSS フィードを翻訳して配信する
- **主な機能**:
  - GitHub Blog Changelog の RSS フィード取得
  - Google Apps Script 経由でのタイトルと本文の翻訳（英語→日本語）
  - 翻訳済み RSS フィードの生成と GitHub Pages での公開
- **配信先**: https://book000.github.io/github-changelog-translator/changelog.xml
- **技術スタック**:
  - 言語: TypeScript 5.9.3
  - ランタイム: Node.js 24.13.0
  - パッケージマネージャー: pnpm 10.28.1

## 開発手順（概要）

1. **プロジェクト理解**:
   - `README.md` と `README-ja.md` を読む
   - `package.json` で依存関係と開発コマンドを確認
   - `src/main.ts` でメインロジックを理解

2. **依存関係インストール**:
   ```bash
   pnpm install
   ```

3. **変更実装**:
   - TypeScript strict モードに準拠
   - JSDoc コメントを日本語で記載
   - エラーメッセージは英語で記載

4. **テストと Lint/Format 実行**:
   ```bash
   # Lint チェック
   pnpm lint

   # Lint 自動修正
   pnpm fix
   ```

5. **コミット**:
   - Conventional Commits に従う
   - `<description>` は日本語

## セキュリティ / 機密情報

- **認証情報のコミット禁止**: API キーや認証情報を含むファイルを Git にコミットしない
- **ログへの機密情報出力禁止**: ログに個人情報や認証情報を出力しない
- **環境変数管理**: GitHub Actions の Secrets で環境変数を管理する

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
- TypeScript プロジェクトにおいて、`skipLibCheck` を有効にして回避することは絶対にしてはならない
