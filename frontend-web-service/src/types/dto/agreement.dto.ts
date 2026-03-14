/**
 * 承諾ログ DTO 型定義
 *
 * 対応画面:
 *  - TemplateLicenseAgreementModal → AgreementLogCreateRequest
 *
 * エンティティ準拠: Agreement_Log
 */

// ─── 承諾種別 ───

/** 承諾種別 — Agreement_Log.agreement_type VARCHAR(30) */
export type AgreementType = 'TEMPLATE_LICENSE';

// ─── 承諾ログ作成 (TemplateLicenseAgreementModal) ───

/**
 * 承諾ログ作成リクエスト POST /agreement-logs
 * → Agreement_Log エンティティ準拠
 */
export interface AgreementLogCreateRequest {
  /** 利用企業ID — Agreement_Log.company_id CHAR(26) */
  company_id: string;
  /** 操作者ユーザーID — Agreement_Log.user_id CHAR(26) */
  user_id: string;
  /** 承諾種別 — Agreement_Log.agreement_type VARCHAR(30) */
  agreement_type: AgreementType;
  /** 承諾バージョン — Agreement_Log.agreement_version VARCHAR(10) */
  agreement_version: string;
  /** 承諾日時 (ISO 8601) — Agreement_Log.agreed_at TIMESTAMP */
  agreed_at: string;
  /** 対象ひな型ID — Agreement_Log.template_id VARCHAR(60) */
  template_id: string;
  /** User-Agent — Agreement_Log.user_agent VARCHAR(500) */
  user_agent: string;
}

/** 承諾ログ作成レスポンス */
export interface AgreementLogCreateResponse {
  /** 作成成功 */
  created: boolean;
}
