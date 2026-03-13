import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

type SecurityInfoModalProps = {
  open: boolean;
  onClose: () => void;
};

const SECURITY_INFO_TEXT = `1. セキュリティへの基本方針
EventPickは、利用企業および一般消費者の皆様の大切なデータを守るため、設計段階からセキュリティを最優先事項として取り組んでいます。Amazon Web Services（AWS）のセキュリティ基盤を活用しながら、多層防御（Defense in Depth）の原則に基づいたセキュリティ対策を実施しています。

2. インフラセキュリティ
2-1 クラウド基盤
本サービスはAmazon Web Services（AWS）上に構築されており、AWSの物理的・論理的セキュリティ基盤（ISO 27001、SOC 2 Type II認証取得済み）を継承しています。

AWS サービス	セキュリティ上の役割
AWS WAF	SQLインジェクション・XSSなどのアプリケーション攻撃を防御
Amazon VPC	仮想プライベートネットワークによるネットワーク分離。パブリック/プライベートサブネットの分離設計
AWS ALB	アプリケーションロードバランサーによるトラフィック制御・分散
Amazon CloudFront	CDNによるキャッシュ配信とAWS Shieldとの連携によるDDoS耐性
Amazon CloudWatch	インフラおよびアプリケーションのリアルタイム監視・アラート
2-2 データセンター
AWSデータセンターは物理的アクセス制御（生体認証・24時間監視）が実施されており、許可された担当者以外は入室できません。

3. 認証・アクセス管理
3-1 認証基盤
機能	採用技術
ユーザー認証	AWS Cognito（エンタープライズグレードのIDaaS）
セッション管理	**JWT（JSON Web Token）**による安全なトークンベース認証
外部認証連携	LINE OAuth / Google OAuth（一般消費者向け）
3-2 多要素認証（MFA）
企業アカウント（法人・拠点）：MFA必須
認証コードはAmazon SESを通じて登録メールアドレスに送信されます
MFAにより、パスワード漏洩時の不正ログインリスクを大幅に低減します
3-3 ロールベースアクセス制御（RBAC）
利用企業のアカウントには以下のロール階層が設定されており、役割に応じた最小権限の原則（Least Privilege Principle）が適用されます。

ロール	アクセス範囲
Root（法人管理者）	全拠点アカウントの管理、プラン・課金管理、審査情報の閲覧
マスター（拠点管理者）	担当拠点の投稿・分析・アカウント設定の管理
派生（担当者）	担当拠点の投稿作成・編集のみ
3-4 セッション管理
一定時間操作がない場合、セッションは自動タイムアウトします
ログアウト時にJWTトークンは無効化されます
同一アカウントへの複数端末からの同時ログインは管理されます
4. 通信セキュリティ
4-1 暗号化通信
本サービスとの全通信はTLS 1.2以上による暗号化が施されています
HTTPによるアクセスは自動的にHTTPSへリダイレクトされます
HTTPSを示すSSL証明書はAWS Certificate Manager（ACM）により管理されます
4-2 APIセキュリティ
すべてのAPI通信はJWTトークンによる認証が必要です
不正なトークンによるアクセスは即時拒否されます
5. データセキュリティ
5-1 保存データの暗号化
データ種別	暗号化方式
データベース（Amazon RDS / MySQL）	AWS KMSによる保存時暗号化
ファイルストレージ（Amazon S3）	AES-256による保存時暗号化（登記簿謄本等の機密ファイル）
バックアップデータ	暗号化バックアップとして別リージョンに保存
5-2 データ分離
利用企業ごとのデータは論理的に分離されており、他の利用企業のデータにアクセスすることはできません。

5-3 バックアップ
データベースは定期的に自動バックアップが実施されます
障害発生時のデータ復旧を目的としたリカバリー体制を整備しています
5-4 退会・データ削除
退会後60日の保持期間経過後、対象データは安全に削除されます。削除後の復元はできません。

6. 監視・ログ管理
6-1 リアルタイム監視
Amazon CloudWatchによりシステム全体のパフォーマンス・可用性・異常検知を24時間365日監視しています。異常を検知した場合、担当エンジニアへ即時アラートが発報されます。

6-2 アクセスログ・操作ログ
企業アカウントの主要操作は「実行履歴」として記録されます（保存期間：3ヶ月）
分析ログは1年間保存されます
ログへのアクセスは運営者の限られた担当者のみに制限されています
7. インシデント対応
7-1 対応体制
セキュリティインシデント（不正アクセス・データ漏洩等）が発生した場合、運営者は以下のプロセスで対応します。

検知・初動対応：監視システムによる自動検知またはユーザー報告の受付後、即時に影響範囲の特定と封じ込め対応を開始します
調査・原因分析：影響範囲・原因の詳細調査を実施します
利用企業への通知：個人情報を含むデータへの影響が確認された場合、速やかに（遅くとも72時間以内を目標）対象の利用企業に通知します
再発防止：原因の根本対応および再発防止策の実施
当局への報告：個人情報保護委員会等への報告が必要な場合、法令に従い対応します
7-2 インシデント報告窓口
セキュリティに関する報告・問い合わせは以下の窓口にご連絡ください。

セキュリティ報告窓口 メール：security@eventpick.jp（※本番運用前に確定してください）

8. 脆弱性管理
8-1 定期的なセキュリティ評価
利用ライブラリ・フレームワークの脆弱性情報を定期的に収集し、重要度に応じてパッチ適用を実施します
Spring Boot・React等の主要コンポーネントは最新のセキュリティパッチを適用します
8-2 脆弱性の報告
本サービスに関するセキュリティ上の脆弱性を発見された場合は、security@eventpick.jpまでご報告ください。報告内容を調査・確認した上で適切に対処します。

9. 利用企業向けセキュリティガイドライン
利用企業においても、以下のセキュリティ対策を実施されることを強く推奨します。

推奨事項	内容
MFAの有効化	全アカウントでMFAを必ず有効にしてください
パスワード管理	他サービスとのパスワード使い回しを避け、複雑なパスワードを設定してください（英大文字・英小文字・数字・記号を組み合わせた12文字以上を推奨）
不審なアクセスの確認	実行履歴ページを定期的に確認し、身に覚えのない操作が記録されていた場合は速やかに運営者へ報告してください
担当者変更時の対応	退職・異動時には速やかに当該担当者のアカウントを無効化または削除してください
フィッシングメールへの注意	運営者（EventPick）を名乗る不審なメールを受信した場合、リンクのクリックやログイン情報の入力はせず、運営事務局にご連絡ください
共有端末でのご利用	業務共有PCでの利用後は必ずログアウトしてください

10. APIレート制限
システム保護のため、一定時間内のAPIリクエスト数に制限を設けています。`;

const infoLines = SECURITY_INFO_TEXT.split('\n');

const SecurityInfoModal: React.FC<SecurityInfoModalProps> = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 'var(--z-modal, 100)',
        display: 'grid',
        placeItems: 'center',
        p: 2,
        backgroundColor: 'rgba(4, 12, 24, 0.56)',
        backdropFilter: 'blur(3px)',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 980,
          borderRadius: '14px',
          border: '1px solid rgba(86, 213, 255, 0.7)',
          background: 'linear-gradient(180deg, rgba(15, 37, 65, 0.97), rgba(10, 28, 52, 0.98))',
          boxShadow: '0 0 0 1px rgba(77, 208, 255, 0.2), 0 14px 30px rgba(2, 14, 30, 0.62)',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            px: 1.4,
            py: 1,
            borderBottom: '1px solid rgba(127, 191, 241, 0.3)',
            background: 'linear-gradient(160deg, rgba(203, 232, 255, 0.14), rgba(113, 174, 228, 0.08))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography sx={{ color: '#eaf6ff', fontSize: '1rem', fontWeight: 900 }}>
            セキュリティ情報
          </Typography>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{ color: '#d6efff', border: '1px solid rgba(165, 210, 246, 0.42)', borderRadius: '9px' }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={{ p: 1.4, maxHeight: '78dvh', overflowY: 'auto' }}>
          <Box sx={{ display: 'grid', gap: 0.2 }}>
            {infoLines.map((line, index) => {
              const isBlank = line.length === 0;
              const isSection = /^\d+\./.test(line);
              const isSubSection = /^\d+-\d+\s/.test(line);
              const isTableRow = line.includes('\t');

              if (isBlank) {
                return <Box key={`blank-${index}`} sx={{ height: 8 }} aria-hidden />;
              }

              if (isTableRow) {
                const cells = line.split('\t');
                return (
                  <Box
                    key={`row-${index}`}
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: cells.length === 2 ? 'minmax(140px, 0.65fr) minmax(0, 1.35fr)' : 'repeat(3, minmax(0, 1fr))',
                      gap: 1.1,
                      py: 0.45,
                      px: 0.7,
                      borderRadius: '8px',
                      backgroundColor: 'rgba(137, 190, 238, 0.08)',
                      border: '1px solid rgba(140, 190, 236, 0.2)',
                    }}
                  >
                    {cells.map((cell, cellIndex) => (
                      <Typography
                        key={`cell-${index}-${cellIndex}`}
                        sx={{
                          color: 'rgba(223, 242, 255, 0.9)',
                          fontSize: '0.79rem',
                          fontWeight: 500,
                          lineHeight: 1.65,
                          whiteSpace: 'pre-wrap',
                        }}
                      >
                        {cell}
                      </Typography>
                    ))}
                  </Box>
                );
              }

              return (
                <Typography
                  key={`line-${index}`}
                  sx={{
                    color: isSection ? '#f4fbff' : 'rgba(219, 239, 255, 0.9)',
                    fontSize: isSection ? '0.93rem' : isSubSection ? '0.84rem' : '0.8rem',
                    fontWeight: isSection ? 900 : isSubSection ? 700 : 500,
                    lineHeight: isSection ? 1.8 : 1.75,
                    letterSpacing: isSection ? '0.01em' : 'normal',
                    mt: isSection ? 0.5 : 0,
                    whiteSpace: 'pre-wrap',
                    pl: isSubSection ? 0.2 : 0,
                  }}
                >
                  {line}
                </Typography>
              );
            })}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SecurityInfoModal;