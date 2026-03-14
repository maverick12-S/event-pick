import type { AuthUserType, AuthLoginType } from './enums';

/**
 * 認証情報 (Auth_Credential)
 * API参照名: Auth_Credential
 */
export interface AuthCredential {
  /** ULID — CHAR(26) */
  auth_id: string;
  /** ユーザー種別 — CHAR(1) */
  user_type: AuthUserType;
  /** 消費者ID — CHAR(26) → User_Account FK (user_type=1時必須) */
  consumer_id?: string;
  /** 拠点アカウントID — CHAR(26) → Company_Account FK (user_type=2時必須) */
  company_account_id?: string;
  /** Cognito sub — VARCHAR(128) 数式(Cognito一意ID) */
  auth_sub: string;
  /** ログイン種別 — CHAR(1) */
  login_type: AuthLoginType;
  /** IPアドレス IPv6対応 — VARCHAR(45) */
  ip_address?: string;
  /** MFA有効フラグ — BOOLEAN */
  is_mfa_enabled: boolean;
  /** アカウント有効フラグ（アプリ側停止用） — BOOLEAN */
  is_enabled: boolean;
  /** ロック状態（不正アクセス対策） — BOOLEAN */
  is_locked: boolean;
  /** ロック理由 — VARCHAR(50) */
  lock_reason?: string;
}
