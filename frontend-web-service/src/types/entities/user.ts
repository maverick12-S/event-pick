import type { UserLoginType, UserGender, ProfileGender, AgeGroup } from './enums';

/**
 * 一般消費者 (User_Account)
 * API参照名: User_Account
 */
export interface UserAccount {
  /** ユーザーID — CHAR(26) UUID(v4) */
  user_id: string;
  /** 外部認証ID Cognito sub — CHAR(36) 外部ID */
  auth_sub: string;
  /** ログイン種別 — VARCHAR(10) */
  login_type: UserLoginType;
  /** ニックネーム（UI表示名） — VARCHAR(15) */
  user_name: string;
  /** メールアドレス RFC準拠 — VARCHAR(254) 条件必須 */
  user_email?: string;
  /** 電話番号 E.164 — VARCHAR(15) 条件必須 */
  phone_number?: string;
  /** 性別 — CHAR(1) */
  user_gender?: UserGender;
  /** 生年 — CHAR(8) */
  birth_year?: string;
  /** 利用規約同意 — BOOLEAN */
  terms_agreed: boolean;
  /** アクティブ状態（論理削除用） — BOOLEAN */
  is_active: boolean;
}

/**
 * ユーザープロファイル(レポート用) (User_Profile)
 * API参照名: User_Profile
 */
export interface UserProfile {
  /** ULID — CHAR(26) 外部ID */
  user_profile_id: string;
  /** 消費者ID — CHAR(26) → User_Account FK */
  consumer_id: string;
  /** 性別 — CHAR(1) */
  gender?: ProfileGender;
  /** 生年 例:1998 — CHAR(4) */
  birth_year?: string;
  /** 年代区分 CASE式 — CHAR(2) */
  age_group?: AgeGroup;
  /** 都道府県ID JISコード — CHAR(2) 外部ID */
  region_id: string;
}

/**
 * お気に入り情報 (User_Favorite)
 * API参照名: User_Favorite
 */
export interface UserFavorite {
  /** ULID — CHAR(26) 外部ID */
  favorite_id: string;
  /** 投稿ID — CHAR(26) → EventPost_c FK */
  post_id: string;
  /** 消費者ID — CHAR(26) → User_Account FK */
  consumer_id: string;
}
