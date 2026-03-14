import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

type CommercialTransactionModalProps = {
  open: boolean;
  onClose: () => void;
};

const COMMERCIAL_TRANSACTION_TEXT = `特定商取引法に基づく表記

販売事業者	シバ カズキ（屋号：Solvevia）
運営統括責任者	シバ カズキ
所在地	ご請求いただければ遅滞なく開示いたします
電話番号	ご請求いただければ遅滞なく開示いたします
メールアドレス	support@eventpick.jp
販売URL	https://eventpick.jp
サービス名称	EventPick
サービス内容	法人向けイベント投稿・管理 SaaS プラットフォーム
販売価格	各プランの月額料金は、サービス内のプラン選択画面に表示される金額に準じます（税込表示）。

プラン	月額料金（税込）
ライトプラン	2,980円
スタンダードプラン	8,600円
プレミアムプラン	27,800円

上記の他に、インターネット接続料金その他の通信料金は利用企業の負担となります。

お支払方法	クレジットカード決済（Stripe 経由）
お支払時期	利用開始時および毎月の契約更新日にご登録のクレジットカードへ請求
サービス提供時期	利用登録の審査完了後、ただちにサービスをご利用いただけます
返品・キャンセルについて	デジタルサービスの性質上、お支払い後の返金はいたしかねます。ただし、サービスの重大な瑕疵に起因する場合はこの限りではありません。
解約について	利用企業は、サービス内の設定画面からいつでもサブスクリプションを解約できます。解約した場合、現在の請求期間の終了日まではサービスをご利用いただけます。解約後の日割り返金はいたしません。
動作環境	最新版の Google Chrome / Microsoft Edge / Safari / Firefox。インターネット接続が必要です。
特別な販売条件	利用登録には法人番号または開業届の提出が必要です。運営者による審査があります。`;

const lines = COMMERCIAL_TRANSACTION_TEXT.split('\n');

const CommercialTransactionModal: React.FC<CommercialTransactionModalProps> = ({ open, onClose }) => {
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
            特定商取引法に基づく表記
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
            {lines.map((line, index) => {
              const isBlank = line.length === 0;
              const isTitle = index === 0;
              const isTableRow = line.includes('\t');

              if (isBlank) {
                return <Box key={`blank-${index}`} sx={{ height: 8 }} aria-hidden />;
              }

              if (isTitle) {
                return (
                  <Typography
                    key={`title-${index}`}
                    sx={{
                      color: '#f4fbff',
                      fontSize: '1.05rem',
                      fontWeight: 900,
                      lineHeight: 1.8,
                      mb: 0.5,
                    }}
                  >
                    {line}
                  </Typography>
                );
              }

              if (isTableRow) {
                const cells = line.split('\t');
                return (
                  <Box
                    key={`row-${index}`}
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: cells.length === 2 ? 'minmax(140px, 0.6fr) minmax(0, 1.4fr)' : 'repeat(3, minmax(0, 1fr))',
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
                          color: cellIndex === 0 ? 'rgba(130, 200, 255, 0.95)' : 'rgba(223, 242, 255, 0.9)',
                          fontSize: '0.79rem',
                          fontWeight: cellIndex === 0 ? 700 : 500,
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
                    color: 'rgba(219, 239, 255, 0.9)',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    lineHeight: 1.75,
                    whiteSpace: 'pre-wrap',
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

export default CommercialTransactionModal;
