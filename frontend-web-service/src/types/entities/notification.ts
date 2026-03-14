import type { UserNotificationType, CompanyNotificationType } from './enums';

/**
 * 消費者通知 (User_Notification)
 * API参照名: User_Notification
 */
export interface UserNotification {
  /** ULID — CHAR(26) 外部ID */
  notification_setting_id: string;
  /** 消費者ID — CHAR(26) → User_Account FK */
  consumer_id: string;
  /** 拠点アカウントID — CHAR(26) → Company_Account FK（企業限定通知用） */
  company_account_id?: string;
  /** カテゴリーID — CHAR(26) → EventCategory_c FK */
  category_id?: string;
  /** 都道府県ID — CHAR(2) → Region_List FK */
  region_id?: string;
  /** 市町村ID — CHAR(5) → City_List FK */
  city_id?: string;
  /** 通知種別 — CHAR(1) */
  notification_type: UserNotificationType;
  /** 有効フラグ（通知ON/OFF） — BOOLEAN */
  is_active: boolean;
}

/**
 * 企業通知 (Company_Notification)
 * API参照名: Company_Notification
 */
export interface CompanyNotification {
  /** ULID — CHAR(26) 外部ID */
  notification_setting_id: string;
  /** 拠点アカウントID — CHAR(26) → Company_Account FK */
  company_account_id: string;
  /** 実行機能コード（例: EVT-B-01） — VARCHAR(20) */
  function_code: string;
  /** 通知有効フラグ — BOOLEAN */
  is_enabled: boolean;
  /** 通知種別 — CHAR(1) */
  notification_type: CompanyNotificationType;
}
