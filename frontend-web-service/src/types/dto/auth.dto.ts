/**
 * 認証系 DTO 型定義
 *
 * 対応画面:
 *  - LoginScreen     → types/auth.ts (LoginRequest / LoginResponse) を使用
 *  - SignupScreen     → SignupRequest
 *  - PasswordResetScreen → PasswordResetRequest
 *  - PasswordChangeScreen → PasswordChangeRequest
 *  - MfaScreen        → MfaVerifyRequest
 *
 * エンティティ準拠: Company, Auth_Credential, Company_Review, Company_Document
 */

import type { AuthUser, LoginResponse } from '../auth';
import type { CompanyType, AuthLoginType } from '../entities';

// ─── 会員登録 (SignupScreen) ────────────────────

/**
 * 会員登録リクエスト POST /auth/signup
 * → Company + Company_Review + Auth_Credential を生成
 *
 * フロントI値（日本語表記含む）をAPIペイロードに変換する際は
 * DB物理名準拠のスネークケースで送信すること。
 */
export interface SignupRequest {
  /** 法人コード — Company.company_code VARCHAR(16) */
  company_code: string;
  /** 企業名（正式） — Company.company_name VARCHAR(80) */
  company_name: string;
  /** 代表者名 — Company.representative_name VARCHAR(40) */
  representative_name: string;
  /** 企業種別 — Company.company_type CHAR(1) */
  company_type: CompanyType;
  /** 管理用メール — Company.admin_email VARCHAR(128) */
  admin_email: string;
  /** 管理用電話番号 E.164 — Company.admin_phone VARCHAR(15) */
  admin_phone?: string;
  /** ログイン種別 — Auth_Credential.login_type CHAR(1) */
  login_type: AuthLoginType;
}

/** 会員登録レスポンス */
export interface SignupResponse {
  /** 審査ID — Company_Review.review_id CHAR(26) */
  review_id: string;
  /** MFA 送信先メールアドレス */
  mfa_destination: string;
}

// ─── パスワードリセット (PasswordResetScreen) ──────

/** パスワードリセットリクエスト POST /auth/password-reset */
export interface PasswordResetRequest {
  /** メールアドレス — Company.admin_email VARCHAR(128) */
  email: string;
}

/** パスワードリセットレスポンス */
export interface PasswordResetResponse {
  sent: boolean;
}

// ─── パスワード変更 (PasswordChangeScreen) ─────────

/** パスワード変更リクエスト POST /auth/password-change */
export interface PasswordChangeRequest {
  /** リセットトークン (MFA通過後に付与) */
  token: string;
  /** 新しいパスワード */
  new_password: string;
}

/** パスワード変更レスポンス */
export interface PasswordChangeResponse {
  changed: boolean;
}

// ─── MFA 認証 (MfaScreen) ──────────────────────────

/**
 * MFA 認証リクエスト POST /auth/mfa/verify
 * → Auth_Credential.is_mfa_enabled 参照
 */
export interface MfaVerifyRequest {
  /** 6桁の認証コード — string (UI入力値) */
  code: string;
  /** MFA の用途 */
  purpose: 'signup' | 'password-reset' | 'login';
  /** セッションIDまたは一時トークン */
  session_token: string;
}

/** MFA 認証レスポンス */
export interface MfaVerifyResponse {
  verified: boolean;
  /** MFA通過後のトークン */
  token?: string;
}

// ─── 現在のユーザー情報 (AuthContext) ──────────────

/** GET /auth/me レスポンス */
export type AuthMeResponse = AuthUser;

// ─── トークンリフレッシュ ──────────────────────────

/** POST /auth/refresh レスポンス */
export type RefreshTokenResponse = Pick<LoginResponse, 'access_token' | 'refresh_token' | 'expires_in'>;
