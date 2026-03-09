import type { ContractPlan } from '../../../api/db/accounts.screen';
import type { IssueAccountFormState, PlanGuideDetail, PlanGuideVisual } from '../types/issueAccount';

export const ISSUE_SCREEN_SCALE = 1.45;

export const PLAN_OPTIONS: ContractPlan[] = ['プレミアムプラン', 'スタンダードプラン', 'ライトプラン'];

export const INITIAL_ISSUE_FORM: IssueAccountFormState = {
  baseName: '',
  displayName: '',
  address: '',
  initialPassword: '',
  plan: 'スタンダードプラン',
  couponCode: '',
};

export const PLAN_DETAILS: Record<ContractPlan, PlanGuideDetail> = {
  プレミアムプラン: {
    monthly: '月額 27,600円',
    outline: '大規模運用に対応する最上位プラン。制限なし。',
    featureList: [
      'イベント投稿：無制限',
      'レポート閲覧：全レポート＋API連携',
      'サポート：専任担当者によるサポート',
      'アカウント数：無制限',
      '通知機能：カスタム通知設定',
      '優先SLA対応',
    ],
  },
  スタンダードプラン: {
    monthly: '月額 8,600円',
    outline: '成長中のチームに必要な機能をすべて揃えた人気プラン。',
    featureList: [
      'イベント投稿：月50件まで',
      'レポート閲覧：詳細レポート＋CSV出力',
      'サポート：メール＋チャットサポート',
      'アカウント数：5アカウントまで',
      '通知機能：リアルタイム通知',
    ],
  },
  ライトプラン: {
    monthly: '月額 2,980円',
    outline: '小規模チームや個人に最適な入門プランです。',
    featureList: [
      'イベント投稿：月10件まで',
      'レポート閲覧：基本レポート',
      'サポート：メールサポート',
      'アカウント数：1アカウント',
    ],
  },
};

export const PLAN_GUIDE_ORDER: ContractPlan[] = ['ライトプラン', 'スタンダードプラン', 'プレミアムプラン'];

export const PLAN_GUIDE_STYLE: Record<ContractPlan, PlanGuideVisual> = {
  ライトプラン: {
    accentColor: '#00d2e6',
    borderColor: 'rgba(0,210,220,0.6)',
    glowColor: 'rgba(0,210,220,0.12)',
    cardGradient: 'linear-gradient(160deg, rgba(14,52,82,0.88) 0%, rgba(11,35,61,0.8) 42%, rgba(7,21,42,0.82) 100%)',
  },
  スタンダードプラン: {
    accentColor: '#e6c800',
    borderColor: 'rgba(220,180,0,0.75)',
    glowColor: 'rgba(220,180,0,0.14)',
    cardGradient: 'linear-gradient(160deg, rgba(74,58,12,0.9) 0%, rgba(52,39,10,0.84) 45%, rgba(33,24,9,0.86) 100%)',
  },
  プレミアムプラン: {
    accentColor: '#c080f0',
    borderColor: 'rgba(160,80,240,0.6)',
    glowColor: 'rgba(160,80,240,0.1)',
    cardGradient: 'linear-gradient(160deg, rgba(50,31,84,0.88) 0%, rgba(39,23,67,0.82) 45%, rgba(22,15,44,0.84) 100%)',
  },
};
