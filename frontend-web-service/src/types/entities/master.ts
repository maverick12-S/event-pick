/**
 * 都道府県リスト (Region_List)
 * API参照名: Region_List
 */
export interface RegionList {
  /** 都道府県ID JISコード — CHAR(2) 外部ID */
  region_id: string;
  /** 都道府県名 — VARCHAR(10) */
  region_name: string;
  /** 有効フラグ — BOOLEAN */
  is_active: boolean;
}

/**
 * 市町村リスト (City_List)
 * API参照名: City_List
 */
export interface CityList {
  /** 市町村ID — CHAR(6) */
  city_id: string;
  /** 都道府県ID — CHAR(2) → Region_List FK */
  region_id: string;
  /** 市町村名 — VARCHAR(30) */
  city_name: string;
  /** 有効フラグ — BOOLEAN */
  is_active: boolean;
}

/**
 * デフォルト検索条件 (Default_Search)
 * API参照名: Default_Search
 */
export interface DefaultSearch {
  /** ULID — CHAR(26) 外部ID */
  search_id: string;
  /** 消費者ID — CHAR(26) → User_Account FK (UNIQUE) 外部ID */
  user_id?: string;
  /** 拠点アカウントID — CHAR(26) 外部ID */
  company_account_id?: string;
  /** キーワード（部分一致） — VARCHAR(100) */
  keyword?: string;
  /** カテゴリーID — CHAR(26) → EventCategory_c FK */
  category_id?: string;
  /** 地域ID — CHAR(2) → Region_List FK */
  region_id?: string;
  /** 市区町村ID — CHAR(6) → City_List FK */
  city_id?: string;
  /** 開始時間 — TIME(8) */
  event_start_time: string;
  /** 終了時間 — TIME(8) */
  event_end_time: string;
}
