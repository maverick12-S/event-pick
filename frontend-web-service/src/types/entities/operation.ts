import type {
  ExecutionType,
  ExecutionTargetType,
  ExecutionResultStatus,
  InquiryType,
  InquiryStatus,
  AdminRoleType,
} from './enums';

/**
 * 企業実行履歴 (Company_Execution_History)
 * API参照名: Company_Execution_History
 */
export interface CompanyExecutionHistory {
  /** ULID — CHAR(26) 外部ID */
  history_id: string;
  /** 拠点アカウントID — CHAR(26) → Company_Account FK */
  company_account_id: string;
  /** 実行機能コード（例: EVT-B-01） — VARCHAR(20) */
  function_code: string;
  /** 実行種別 — CHAR(1) */
  execution_type: ExecutionType;
  /** 実行対象種別 — CHAR(1) */
  target_type: ExecutionTargetType;
  /** 実行結果 — CHAR(1) */
  result_status: ExecutionResultStatus;
  /** エラーメッセージ（失敗時のみ） — VARCHAR(200) */
  error_message?: string;
}

/**
 * お問い合わせ情報 (InquiryHistory)
 * API参照名: InquiryHistory
 */
export interface InquiryHistory {
  /** ULID — CHAR(26) 外部ID */
  inquiry_id: string;
  /** 問い合わせ種別 — CHAR(1) */
  inquiry_type: InquiryType;
  /** 消費者ID — CHAR(26) → User_Account FK */
  user_id?: string;
  /** 企業ID — CHAR(26) → Company FK */
  company_id?: string;
  /** 件名 — VARCHAR(100) */
  subject: string;
  /** 内容 — TEXT(1500) */
  message: string;
  /** 対応状態 — CHAR(1) */
  inquiry_status: InquiryStatus;
  /** 担当運営ユーザーID — CHAR(26) → AdminUser FK */
  admin_user_id?: string;
}

/**
 * 運営情報 (AdminUser)
 * API参照名: AdminUser
 *
 * NOTE: 既存の features/admin/types/admin.ts の AdminUser とは
 * プロパティ構成が異なる（DB定義準拠 vs UI表示用）。
 * エンティティ名を AdminUserEntity として区別する。
 */
export interface AdminUserEntity {
  /** ULID — CHAR(26) 外部ID */
  admin_user_id: string;
  /** 企業権限ID — VARCHAR(50) 一意制約 */
  company_role_id: string;
  /** 権限種別 — CHAR(1) */
  role_type: AdminRoleType;
  /** 運営ユーザー名（UI用） — VARCHAR(40) */
  admin_display_name?: string;
  /** 郵便番号（ハイフンなし） — CHAR(7) */
  postal_code?: string;
  /** 都道府県コード JIS — CHAR(2) */
  prefecture_code: string;
  /** 市区町村 — VARCHAR(30) */
  city: string;
  /** 住所詳細 — VARCHAR(60) */
  address_line?: string;
  /** 電話番号 — VARCHAR(15) */
  phone_number?: string;
  /** メールアドレス — VARCHAR(80) */
  contact_email?: string;
}
