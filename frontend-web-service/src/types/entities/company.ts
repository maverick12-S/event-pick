import type {
  CompanyType,
  CompanyRoleId,
  RoleCode,
  RoleName,
  CompanyAccountStatus,
} from './enums';

/**
 * 企業 (Company)
 * API参照名: Company
 */
export interface Company {
  /** ULID — CHAR(26) */
  company_id: string;
  /** 法人コード — VARCHAR(16) 外部ID、拠点連携キー */
  company_code: string;
  /** 企業名（正式・登記名） — VARCHAR(80) */
  company_name: string;
  /** 企業名（表示用） — VARCHAR(40) */
  display_name: string;
  /** 企業種別 — CHAR(1) */
  company_type: CompanyType;
  /** 代表者名 — VARCHAR(40) */
  representative_name: string;
  /** 管理用メール — VARCHAR(128) */
  admin_email: string;
  /** 管理用電話番号 E.164 — VARCHAR(15) */
  admin_phone?: string;
}

/**
 * 拠点アカウント (Company_Account)
 * API参照名: Company_Account
 *
 * NOTE: 定義書ではcompany_account_idがUUID(36)だが、
 * FK参照側(Auth_Credential等)はCHAR(26)。実装時に要確認。
 */
export interface CompanyAccount {
  /** 内部主キー — UUID(36) 外部ID */
  company_account_id: string;
  /** 企業ID — UUID(36) → Company FK */
  company_id: string;
  /** 企業ロールID — CHAR(2) → Company_Role FK */
  company_role_id: CompanyRoleId;
  /** 拠点コード（企業内一意） — VARCHAR(10) 外部ID */
  branch_code: string;
  /** 拠点名（店舗名） — VARCHAR(40) */
  branch_name: string;
  /** 拠点名（表示用） — VARCHAR(40) */
  branch_display_name?: string;
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
  /** ステータス（有効/停止） — CHAR(1) */
  status: CompanyAccountStatus;
}

/**
 * 企業ロール (Company_Role)
 * API参照名: Company_Role
 */
export interface CompanyRole {
  /** 企業ロールID — CHAR(2) 外部ID */
  company_role_id: CompanyRoleId;
  /** ロールコード — VARCHAR(10) */
  role_code: RoleCode;
  /** ロール名（和名） — VARCHAR(20) */
  role_name: RoleName;
}

/**
 * チケット数管理 (Company_Ticket)
 * API参照名: Company_Ticket
 */
export interface CompanyTicket {
  /** ULID — CHAR(26) 外部ID */
  ticket_id: string;
  /** 企業ID — CHAR(26) → Company FK */
  company_id: string;
  /** デイリー付与数 — INT(4) */
  daily_granted: number;
  /** デイリー使用数 — INT(4) */
  daily_used: number;
  /** デイリー残数 — INT(4) 数式: daily_granted - daily_used */
  daily_remaining: number;
  /** デイリー最終リセット日 — DATE(10) */
  daily_reset_at: string;
  /** マンスリー付与数 — INT(6) */
  monthly_granted: number;
  /** マンスリー使用数 — INT(6) */
  monthly_used: number;
  /** マンスリー残数 — INT(6) 数式: monthly_granted - monthly_used */
  monthly_remaining: number;
  /** 対象年月 YYYYMM — CHAR(6) */
  monthly_target: string;
}
