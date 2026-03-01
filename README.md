# event-pick
EventPickアプリは「今行われている地域イベント」と「人」をつなぐ、リアルタイム型イベント発見・集客プラットフォーム。

# event-pick Git Strategy & CI/CD Policy

このドキュメントは event-pick 開発における
Git運用方針およびCI/CD戦略を明確にするためのガイドです。

本プロジェクトは、
「安全に機能開発を行い、段階的に品質を保証し、本番へデプロイする」
ことを目的としています。

---

# 🎯 開発方針の全体像

event-pick は以下の流れで品質を担保します。

1. featureブランチで機能開発
2. push時に単体テスト実行
3. developブランチで統合テスト（E2E）
4. mainブランチで本番デプロイ

---

# 🌳 ブランチ戦略
main → 本番環境ブランチ
develop → 統合検証ブランチ
feature/* → 機能開発ブランチ


---

## 🔹 feature/*

- 新機能・修正は必ず feature ブランチで作業
- 例: feature-login-api
- push時に Unit Test が自動実行される

目的:
高速なフィードバックとローカル品質保証

---

## 🔹 develop

- feature ブランチをマージする統合ブランチ
- マージ後に E2Eテスト（Playwright）が実行される

目的:
機能間の整合性確認
統合レベルでの品質担保

---

## 🔹 main

- 本番環境専用ブランチ
- develop でテスト済みのコードのみをマージ
- push時にデプロイ実行（AWS）

目的:
安全なリリース管理

---

# 🧪 テスト戦略

## ① Unit Test（単体テスト）

実行タイミング:
feature ブランチへの push

対象:
- Frontend → Vitest
- Backend → JUnit

特徴:
- 変更された側のみ実行
- 高速
- ロジック単位の保証

---

## ② E2E Test（結合テスト）

実行タイミング:
develop ブランチへの push（featureマージ時）

対象:
- Playwright

内容:
- フロント + バック + DB を Docker 上で起動
- 実際の画面操作レベルで検証

目的:
統合品質の保証

---

# 🚀 デプロイ戦略

## 本番デプロイ

実行タイミング:
main ブランチへの push

内容:
- Backend → EC2 コンテナ更新
- Frontend → S3 / CloudFront 更新

※ AWS接続未設定時はデプロイはスキップされる

---

# 🐳 Dockerの役割

Dockerは以下の用途で利用する。

1. ローカル統合開発環境
2. CI内の統合テスト環境
3. 本番デプロイ単位

Dockerにより、
ローカル・CI・本番で同一環境を再現可能にする。

---

# 🔐 品質ゲート

- Unit Test が失敗した場合 → developにマージ不可
- E2Eが失敗した場合 → mainへマージ不可
- mainは常にデプロイ可能状態を維持する

---

# 📈 CI/CD段階的導入ポリシー

本プロジェクトではCI/CDを段階的に導入する。

現状:
- Unit Testはスキップ可能設計
- Playwright未導入時はE2Eスキップ
- AWS未接続時はデプロイ無効

将来:
- 全テスト必須化
- デプロイ自動化完全有効化
- Blue/Greenデプロイ導入

---

# 🎯 この戦略のメリット

- feature単位で安全に開発可能
- 統合前に品質確認できる
- 本番事故リスクを最小化
- 段階的に成熟可能
- 中規模以上のプロダクト運用に耐えうる設計

---

# 📌 運用ルール

1. mainへ直接push禁止
2. developへ直接push禁止（PR経由）
3. featureは小さく保つ
4. E2Eが通らない状態でmainへ進めない

---

この戦略に基づき、
event-pick の品質と開発効率を両立させる。