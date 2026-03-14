/**
 * Agreement_Log エンティティ型定義
 *
 * テーブル: Agreement_Log
 * 承諾記録の永続化レコード。紛争時の証跡として利用。
 * ip_address はサーバーサイドで req.ip 等から付与する。
 */

/** 承諾種別 */
export type AgreementType = 'TEMPLATE_LICENSE';

/** Agreement_Log テーブルエンティティ */
export interface AgreementLog {
  /** 承諾ログID — agreement_log_id CHAR(26) PK (ULID) */
  agreement_log_id: string;
  /** 利用企業ID — company_id CHAR(26) FK → Company_Account */
  company_id: string;
  /** 操作者ユーザーID — user_id CHAR(26) FK → User_Account */
  user_id: string;
  /** 承諾種別 — agreement_type VARCHAR(30) */
  agreement_type: AgreementType;
  /** 承諾バージョン — agreement_version VARCHAR(10) */
  agreement_version: string;
  /** 承諾日時 — agreed_at TIMESTAMP */
  agreed_at: string;
  /** 対象ひな型ID — template_id VARCHAR(60) */
  template_id: string;
  /** IP アドレス — ip_address VARCHAR(45) (サーバー付与) */
  ip_address: string | null;
  /** User-Agent — user_agent VARCHAR(500) */
  user_agent: string;
  /** 作成日時 — created_at TIMESTAMP */
  created_at: string;
}
