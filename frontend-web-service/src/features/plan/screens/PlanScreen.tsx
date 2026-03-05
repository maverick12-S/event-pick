/**
 * PlanScreen — プラン選択画面
 * ─────────────────────────────────────────────
 * ・ライト / スタンダード / プレミアムの3プランカード
 * ・各カードに価格・説明・機能リスト・選択ボタン
 * ・クーポンコード入力欄と適用ボタン
 * ・スクロール対応、レスポンシブ対応
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheck, FiTag } from 'react-icons/fi';
import styles from './PlanScreen.module.css';

// ────────────────────────────────────────────────
// 定数
// ────────────────────────────────────────────────

type PlanId = 'light' | 'standard' | 'premium';

interface Plan {
  id: PlanId;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  badge?: string;
  cardClass: string;
  headerClass: string;
  btnClass: string;
}

const PLANS: Plan[] = [
  {
    id: 'light',
    name: 'ライトプラン',
    price: 2980,
    period: '月',
    description: '小規模チームや個人に最適な入門プランです。',
    features: [
      'イベント投稿：月10件まで',
      'レポート閲覧：基本レポート',
      'サポート：メールサポート',
      'アカウント数：1アカウント',
    ],
    cardClass: styles.planLight,
    headerClass: styles.planHeaderLight,
    btnClass: styles.btnLight,
  },
  {
    id: 'standard',
    name: 'スタンダードプラン',
    price: 8600,
    period: '月',
    description: '成長中のチームに必要な機能をすべて揃えた人気プラン。',
    features: [
      'イベント投稿：月50件まで',
      'レポート閲覧：詳細レポート＋CSV出力',
      'サポート：メール＋チャットサポート',
      'アカウント数：5アカウントまで',
      '通知機能：リアルタイム通知',
    ],
    badge: 'おすすめ',
    cardClass: styles.planStandard,
    headerClass: styles.planHeaderStandard,
    btnClass: styles.btnStandard,
  },
  {
    id: 'premium',
    name: 'プレミアムプラン',
    price: 27600,
    period: '月',
    description: '大規模運用に対応する最上位プラン。制限なし。',
    features: [
      'イベント投稿：無制限',
      'レポート閲覧：全レポート＋API連携',
      'サポート：専任担当者によるサポート',
      'アカウント数：無制限',
      '通知機能：カスタム通知設定',
      '優先SLA対応',
    ],
    cardClass: styles.planPremium,
    headerClass: styles.planHeaderPremium,
    btnClass: styles.btnPremium,
  },
];

// 価格フォーマット (例: 2980 → "2,980")
const formatPrice = (n: number): string =>
  n.toLocaleString('ja-JP');

// ────────────────────────────────────────────────
// コンポーネント
// ────────────────────────────────────────────────

const PlanScreen: React.FC = () => {
  const navigate = useNavigate();

  // プラン選択状態
  const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(null);
  const [selectLoading, setSelectLoading] = useState<PlanId | null>(null);

  // クーポン状態
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponResult, setCouponResult] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // ─── プラン選択ハンドラ ────────────────────────
  const handleSelectPlan = async (planId: PlanId) => {
    setSelectLoading(planId);
    try {
      // TODO: 実際のプラン選択 API を呼び出す
      await new Promise((r) => setTimeout(r, 800));
      setSelectedPlan(planId);
      // プラン選択後はダッシュボードかホームへ遷移
      navigate('/home');
    } catch {
      // エラー処理 (必要に応じてトースト等を追加)
    } finally {
      setSelectLoading(null);
    }
  };

  // ─── クーポン適用ハンドラ ──────────────────────
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponResult({ type: 'error', message: 'クーポンコードを入力してください。' });
      return;
    }
    setCouponLoading(true);
    setCouponResult(null);
    try {
      // TODO: 実際のクーポン検証 API を呼び出す
      await new Promise((r) => setTimeout(r, 900));
      // サンプルロジック: "DEMO10" で成功
      if (couponCode.trim().toUpperCase() === 'DEMO10') {
        setCouponResult({ type: 'success', message: 'クーポンが適用されました！10% 割引が適用されます。' });
      } else {
        setCouponResult({ type: 'error', message: '無効なクーポンコードです。もう一度ご確認ください。' });
      }
    } catch {
      setCouponResult({ type: 'error', message: 'クーポンの確認中にエラーが発生しました。' });
    } finally {
      setCouponLoading(false);
    }
  };

  // ─── Enter キーでクーポン適用 ─────────────────
  const handleCouponKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleApplyCoupon();
  };

  // ────────────────────────────────────────────────
  return (
    <div className={styles.page}>
      {/* ページタイトル */}
      <div className={styles.titleSection}>
        <h1>プランを選択</h1>
        <p className={styles.subtitle}>
          ご利用状況に合わせたプランをお選びください。いつでも変更できます。
        </p>
      </div>

      {/* プランカードグリッド */}
      <div className={styles.plansGrid} role="list" aria-label="プラン一覧">
        {PLANS.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          const isLoading = selectLoading === plan.id;

          return (
            <div
              key={plan.id}
              className={`${styles.planCard} ${plan.cardClass} ${isSelected ? styles.planSelected : ''}`}
              role="listitem"
            >
              {/* おすすめバッジ */}
              {plan.badge && (
                <span className={styles.badge} aria-label="おすすめプラン">
                  {plan.badge}
                </span>
              )}

              {/* プランヘッダー */}
              <div className={`${styles.planHeader} ${plan.headerClass}`}>
                {plan.name}
              </div>

              {/* 価格 */}
              <div className={styles.price}>
                <span className={styles.priceCurrency}>¥</span>
                <span className={styles.priceAmount}>{formatPrice(plan.price)}</span>
                <span className={styles.pricePeriod}>/{plan.period}</span>
              </div>

              {/* 説明 */}
              <p className={styles.description}>{plan.description}</p>

              {/* 機能リスト */}
              <ul className={styles.featureList} aria-label={`${plan.name}の機能`}>
                {plan.features.map((feature, idx) => (
                  <li key={idx} className={styles.featureItem}>
                    <FiCheck className={styles.featureCheck} aria-hidden />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* 選択ボタン */}
              <button
                type="button"
                className={`${styles.selectButton} ${plan.btnClass}`}
                onClick={() => handleSelectPlan(plan.id)}
                disabled={isLoading}
                aria-label={`${plan.name}を選択する`}
                aria-pressed={isSelected}
              >
                {isLoading ? (
                  <span className={styles.loadingDots}>
                    処理中<span className={styles.dot1}>.</span>
                    <span className={styles.dot2}>.</span>
                    <span className={styles.dot3}>.</span>
                  </span>
                ) : isSelected ? (
                  '選択済み ✓'
                ) : (
                  'このプランを選択'
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* クーポンセクション */}
      <section className={styles.couponSection} aria-label="クーポン入力">
        <div className={styles.couponTitle}>
          <FiTag aria-hidden className={styles.couponIcon} />
          クーポンコードをお持ちの方
        </div>

        <div className={styles.couponRow}>
          <input
            type="text"
            className={styles.couponInput}
            placeholder="クーポンコードを入力"
            value={couponCode}
            onChange={(e) => {
              setCouponCode(e.target.value);
              setCouponResult(null);
            }}
            onKeyDown={handleCouponKeyDown}
            aria-label="クーポンコード入力"
            aria-describedby={couponResult ? 'coupon-message' : undefined}
            disabled={couponLoading}
            maxLength={30}
          />
          <button
            type="button"
            className={styles.couponButton}
            onClick={handleApplyCoupon}
            disabled={couponLoading || !couponCode.trim()}
            aria-label="クーポンを使用する"
          >
            {couponLoading ? '確認中…' : 'クーポンを使用する'}
          </button>
        </div>

        {couponResult && (
          <p
            id="coupon-message"
            className={`${styles.couponMessage} ${
              couponResult.type === 'success' ? styles.couponSuccess : styles.couponError
            }`}
            role="alert"
          >
            {couponResult.message}
          </p>
        )}
      </section>

      {/* 下部余白 */}
      <div className={styles.bottomPad} aria-hidden />
    </div>
  );
};

export default PlanScreen;
