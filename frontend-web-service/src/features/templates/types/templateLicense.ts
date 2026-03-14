/**
 * テンプレートライセンス承諾 — コンポーネント Props 型定義
 */

/** TemplateLicenseAgreementModal の Props */
export type TemplateLicenseAgreementModalProps = {
  open: boolean;
  onClose: () => void;
  /** どのひな型に同意したか */
  templateId: string;
  /** 利用企業ID */
  companyId: string;
  /** 操作者ユーザーID */
  userId: string;
  /** 承諾後のダウンロード処理を呼び出し元に委譲 */
  onDownloadReady?: (templateId: string) => void;
};
