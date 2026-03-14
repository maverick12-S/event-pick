/**
 * オブジェクト定義書 — 選択リスト型定義
 * DB格納値に完全準拠。物理名の選択リストをリテラル型として定義。
 */

// ===== Company (企業) =====
/** 企業種別 — 1:法人 / 2:個人事業 */
export type CompanyType = '1' | '2';

// ===== Company_Account (拠点アカウント) =====
/** 拠点アカウントステータス — 有効/停止 (CHAR 1) */
export type CompanyAccountStatus = '1' | '2';

// ===== Company_Role (企業ロール) =====
/** 企業ロールID — 01:親企業 / 02:子拠点 / 03:運営 */
export type CompanyRoleId = '01' | '02' | '03';
/** ロールコード — PARENT / CHILD / ADMIN */
export type RoleCode = 'PARENT' | 'CHILD' | 'ADMIN';
/** ロール名（和名） */
export type RoleName = '親企業' | '子拠点' | '運営';

// ===== Auth_Credential (認証情報) =====
/** ユーザー種別 — 1:消費者 / 2:拠点 */
export type AuthUserType = '1' | '2';
/** ログイン種別(認証テーブル) — 1:email / 2:phone / 3:google / 4:line */
export type AuthLoginType = '1' | '2' | '3' | '4';

// ===== Company_Review (法人審査) =====
/** 申請種別 — 1:新規 / 2:更新 / 3:再申請 */
export type ReviewType = '1' | '2' | '3';
/** 審査ステータス — 1:申請中 / 2:承認 / 3:差戻し / 4:却下 */
export type ReviewStatus = '1' | '2' | '3' | '4';

// ===== Company_Document (提出書類) =====
/** 書類種別 — 01:登記簿謄本 / 02:本人確認 / 03:営業許可証 / 99:その他 */
export type DocumentType = '01' | '02' | '03' | '99';
/** アップロード者種別 — 1:企業 / 2:運営 */
export type UploadedByType = '1' | '2';

// ===== User_Profile (ユーザープロファイル) =====
/** 性別(プロファイル) — 1:男性 / 2:女性 / 3:その他 */
export type ProfileGender = '1' | '2' | '3';
/** 年代区分 — 10/20/30/40/50/60 */
export type AgeGroup = '10' | '20' | '30' | '40' | '50' | '60';

// ===== Company_Plan (企業プラン) =====
/** 企業プランID (CHAR 2) */
export type CompanyPlanId = '01' | '02' | '03';
/** 企業プランコード — LIGHT / STANDARD / PREMIUM */
export type CompanyPlanCode = 'LIGHT' | 'STANDARD' | 'PREMIUM';

// ===== User_Plan (一般消費者プラン) =====
/** 消費者プランID (CHAR 2) */
export type UserPlanId = '01' | '02';
/** 消費者プランコード — FREE / AD_FREE */
export type UserPlanCode = 'FREE' | 'AD_FREE';

// ===== Company_Subscription / User_Subscription (契約管理) =====
/** 契約ステータス — 1:有効 / 2:停止 / 3:解約予約 / 4:解約済 */
export type SubscriptionStatusCode = '1' | '2' | '3' | '4';

// ===== Company_Billing / User_Payment_Status (請求管理) =====
/** 支払状態 — 1:未請求 / 2:請求済 / 3:支払済 / 4:失敗 */
export type PaymentStatusCode = '1' | '2' | '3' | '4';

// ===== EventPost_c (イベント一覧) =====
/** イベント公開状態 — 1:公開前 / 2:公開中 / 3:終了 */
export type EventPostStatus = '1' | '2' | '3';

// ===== Event_Template_c (イベントテンプレート) =====
/** テンプレ状態 — 1:下書き / 2:使用可 / 3:停止 */
export type EventTemplateStatus = '1' | '2' | '3';

// ===== EventSchedule_c (イベント開催日程) =====
/** 投稿状態 — 1:未生成 / 2:生成済 / 3:停止 */
export type EventSchedulePostStatus = '1' | '2' | '3';

// ===== Plan_Coupon (クーポン) =====
/** クーポン対象種別 — 1:企業 / 2:消費者 */
export type CouponTargetType = '1' | '2';
/** クーポン割引種別 — 1:金額 / 2:率 */
export type CouponDiscountType = '1' | '2';

// ===== User_Notification (消費者通知) =====
/** 通知種別(消費者) — 1:Push / 2:Mail */
export type UserNotificationType = '1' | '2';

// ===== Company_Notification (企業通知) =====
/** 通知種別(企業) — 1:メール / 2:Push / 3:両方 */
export type CompanyNotificationType = '1' | '2' | '3';

// ===== Company_Execution_History (企業実行履歴) =====
/** 実行種別 — 1:API / 2:Batch / 3:Admin */
export type ExecutionType = '1' | '2' | '3';
/** 実行対象種別 — 1:投稿 / 2:契約 / 3:請求 / 4:通知 */
export type ExecutionTargetType = '1' | '2' | '3' | '4';
/** 実行結果 — 1:成功 / 2:失敗 */
export type ExecutionResultStatus = '1' | '2';

// ===== InquiryHistory (お問い合わせ) =====
/** 問い合わせ種別 — 1:消費者 / 2:企業 */
export type InquiryType = '1' | '2';
/** 対応状態 — 1:未対応 / 2:対応中 / 3:完了 */
export type InquiryStatus = '1' | '2' | '3';

// ===== AdminUser (運営情報) =====
/** 権限種別 — 1:管理者 / 2:オペレータ */
export type AdminRoleType = '1' | '2';

// ===== User_Account (一般消費者) =====
/** ログイン種別(消費者テーブル) — email / phone / google / line */
export type UserLoginType = 'email' | 'phone' | 'google' | 'line';
/** 性別(消費者) — M / F / O */
export type UserGender = 'M' | 'F' | 'O';
