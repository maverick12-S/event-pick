import type { ReviewType, ReviewStatus, DocumentType, UploadedByType } from './enums';

/**
 * 法人審査 (Company_Review)
 * API参照名: Company_Review
 */
export interface CompanyReview {
  /** ULID — CHAR(26) 外部ID */
  review_id: string;
  /** 企業ID — CHAR(26) → Company FK */
  company_id: string;
  /** 申請種別 — CHAR(1) */
  review_type: ReviewType;
  /** 審査ステータス — CHAR(1) */
  review_status: ReviewStatus;
  /** 申請日時 — DATETIME(19) */
  applied_at: string;
  /** 審査完了日時（承認/却下時） — DATETIME(19) */
  reviewed_at?: string;
  /** 審査担当者ID（運営アカウントID） — CHAR(26) */
  reviewer_id?: string;
  /** 差戻理由（差戻し時必須） — VARCHAR(200) */
  review_comment?: string;
  /** 有効フラグ（現行審査のみtrue） — BOOLEAN */
  is_active: boolean;
}

/**
 * 提出書類 (Company_Document)
 * API参照名: Company_Document
 */
export interface CompanyDocument {
  /** ULID — CHAR(26) 外部ID */
  document_id: string;
  /** 企業ID — CHAR(26) → Company FK */
  company_id: string;
  /** 審査ID — CHAR(26) → Company_Review FK（審査紐付け時） */
  review_id?: string;
  /** 書類種別 — CHAR(2) */
  document_type: DocumentType;
  /** ファイル名（表示用） — VARCHAR(100) */
  file_name: string;
  /** 保存パス（S3キー） — VARCHAR(255) */
  file_path: string;
  /** MIMEタイプ — VARCHAR(50) */
  mime_type: string;
  /** ファイルサイズ（byte） — INT(10) */
  file_size: number;
  /** アップロード者種別 — CHAR(1) */
  uploaded_by_type: UploadedByType;
  /** アップロード日時 — DATETIME(19) */
  uploaded_at: string;
  /** 有効フラグ（差し替え時false） — BOOLEAN */
  is_active: boolean;
}
