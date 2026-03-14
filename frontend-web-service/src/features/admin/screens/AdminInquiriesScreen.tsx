/**
 * AdminInquiriesScreen
 * ─────────────────────────────────────────────
 * お問い合わせ管理画面。企業 / 消費者タブで分けて表示。
 */

import React, { useState, useMemo } from 'react';
import {
  FiSearch,
  FiUser,
  FiMail,
  FiCalendar,
  FiTag,
  FiBriefcase,
  FiUsers,
} from 'react-icons/fi';
import styles from './AdminInquiriesScreen.module.css';
import type { InquiryScreenStatus, SenderType, Inquiry } from '../types/admin';
import { useFormValidation } from '../../../lib/useFormValidation';
import { adminInquiryReplyFormSchema } from '../../../lib/formSchemas';

// ──────── モックデータ ────────
const MOCK_INQUIRIES: Inquiry[] = [
  { id: 'inq001', subject: 'イベント掲載審査の進捗について', body: 'お世話になっております。3月5日に申請したイベント「春の音楽祭2026」の審査状況をお教えいただけますでしょうか。\n掲載開始予定日が近づいておりますので、早めにご回答いただけますと助かります。', senderName: '山田 太郎（株式会社イベントプロ）', senderEmail: 'yamada@eventpro.co.jp', senderType: 'corporate', category: 'イベント掲載', status: 'open', createdAt: '2026-03-12T10:00:00Z' },
  { id: 'inq002', subject: 'クーポンコードが適用されません', body: 'クーポンコード「WELCOME2026」を入力しましたが、割引が反映されません。\nイベント: サマーフェスティバル東京\nチケット種別: 一般入場\nご確認をお願いいたします。', senderName: '鈴木 花子', senderEmail: 'suzuki@example.com', senderType: 'consumer', category: 'クーポン', status: 'in_progress', createdAt: '2026-03-11T15:30:00Z', reply: '鈴木様、お問い合わせありがとうございます。現在クーポンの適用条件を確認中です。確認が取れ次第ご連絡いたします。' },
  { id: 'inq003', subject: 'アカウント情報の変更依頼', body: '法人名の変更がありましたので、登録情報の更新をお願いいたします。\n旧法人名: 株式会社ABC\n新法人名: 株式会社ABCホールディングス\n変更届の登記簿謄本は別途メールにてお送りいたします。', senderName: '佐藤 健一（株式会社ABCホールディングス）', senderEmail: 'sato@abc-holdings.co.jp', senderType: 'corporate', category: 'アカウント', status: 'open', createdAt: '2026-03-10T09:15:00Z' },
  { id: 'inq004', subject: '決済に関するお問い合わせ', body: '2月分の売上レポートに誤りがあるようです。イベントID: EVT-2026-0145 の売上が二重計上されています。\nご確認・修正をお願いいたします。', senderName: '高橋 由美（株式会社セレブレーション）', senderEmail: 'takahashi@celebration.co.jp', senderType: 'corporate', category: '決済', status: 'closed', createdAt: '2026-03-08T14:00:00Z', reply: '高橋様、ご連絡ありがとうございます。ご指摘の二重計上を確認し、修正いたしました。修正後のレポートはダッシュボードからご確認いただけます。' },
  { id: 'inq005', subject: '拠点追加の手続きについて', body: '新しい拠点（大阪支店）を追加したいのですが、手続きの流れを教えていただけますでしょうか。\n必要書類等ありましたらあわせてお知らせください。', senderName: '中村 誠（合同会社フェスタ）', senderEmail: 'nakamura@festa.jp', senderType: 'corporate', category: 'アカウント', status: 'open', createdAt: '2026-03-13T08:00:00Z' },
  { id: 'inq006', subject: 'チケットのキャンセル方法について', body: '先日購入した「東京フードフェス2026」のチケットをキャンセルしたいです。\n注文番号: ORD-20260308-0012\nキャンセルポリシーと手順をお教えください。', senderName: '田村 美樹', senderEmail: 'tamura@example.com', senderType: 'consumer', category: 'チケット', status: 'open', createdAt: '2026-03-12T16:30:00Z' },
  { id: 'inq007', subject: 'アプリの表示がおかしい', body: 'イベント詳細ページで画像が表示されません。\n端末: iPhone 15 Pro\nOS: iOS 19.2\nブラウザ: Safari\nスクリーンショットを添付します。', senderName: '佐野 翔太', senderEmail: 'sano@example.com', senderType: 'consumer', category: '技術', status: 'in_progress', createdAt: '2026-03-09T16:45:00Z' },
  { id: 'inq008', subject: 'イベント参加のお礼とフィードバック', body: '先日のワインフェスティバルに参加しました。素晴らしいイベントでした！\n一点、会場内のWi-Fi環境が不安定だったので、次回は改善していただけると嬉しいです。', senderName: '木村 麻衣', senderEmail: 'kimura@example.com', senderType: 'consumer', category: 'フィードバック', status: 'closed', createdAt: '2026-03-07T11:00:00Z', reply: '木村様、貴重なフィードバックをありがとうございます。Wi-Fi環境の改善について、イベント主催者と共有いたしました。' },
];

const STATUS_LABELS: Record<InquiryScreenStatus, string> = { open: '対応待ち', in_progress: '対応中', closed: '完了' };
const SENDER_TYPE_LABELS: Record<SenderType, string> = { corporate: '企業', consumer: '消費者' };
type StatusFilter = 'all' | InquiryScreenStatus;

const AdminInquiriesScreen: React.FC = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>(MOCK_INQUIRIES);
  const [senderTab, setSenderTab] = useState<'all' | SenderType>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [replyText, setReplyText] = useState('');
  const { validate: validateReply } = useFormValidation(adminInquiryReplyFormSchema);

  // サマリー
  const summary = useMemo(() => ({
    open: inquiries.filter((i) => i.status === 'open').length,
    inProgress: inquiries.filter((i) => i.status === 'in_progress').length,
    closed: inquiries.filter((i) => i.status === 'closed').length,
  }), [inquiries]);

  // 送信者タブ別件数
  const senderCounts = useMemo(() => ({
    all: inquiries.length,
    corporate: inquiries.filter((i) => i.senderType === 'corporate').length,
    consumer: inquiries.filter((i) => i.senderType === 'consumer').length,
  }), [inquiries]);

  // フィルタリング
  const filtered = useMemo(() => {
    let result = inquiries;
    if (senderTab !== 'all') result = result.filter((i) => i.senderType === senderTab);
    if (statusFilter !== 'all') result = result.filter((i) => i.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((i) =>
        i.subject.toLowerCase().includes(q) ||
        i.senderName.toLowerCase().includes(q) ||
        i.senderEmail.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q),
      );
    }
    return result;
  }, [inquiries, senderTab, statusFilter, search]);

  const openDetail = (inq: Inquiry) => { setSelected(inq); setReplyText(inq.reply ?? ''); };

  const handleReply = () => {
    if (!selected) return;
    const result = validateReply({ replyText });
    if (!result.success) return;
    setInquiries((prev) => prev.map((i) => i.id === selected.id ? { ...i, status: 'in_progress' as const, reply: replyText.trim() } : i));
    setSelected((prev) => prev ? { ...prev, status: 'in_progress', reply: replyText.trim() } : null);
  };

  const handleClose = () => {
    if (!selected) return;
    setInquiries((prev) => prev.map((i) => i.id === selected.id ? { ...i, status: 'closed' as const } : i));
    setSelected(null);
  };

  return (
    <div className={styles.page}>
      {/* サマリーKPI */}
      <section className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>対応待ち</span>
          <span className={`${styles.summaryValue} ${styles.open}`}>{summary.open}</span>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>対応中</span>
          <span className={`${styles.summaryValue} ${styles.inProgress}`}>{summary.inProgress}</span>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>完了</span>
          <span className={`${styles.summaryValue} ${styles.closed}`}>{summary.closed}</span>
        </div>
      </section>

      {/* 送信者タブ */}
      <div className={styles.senderTabBar}>
        {([['all', 'すべて', null], ['corporate', '企業', <FiBriefcase key="c" />], ['consumer', '消費者', <FiUsers key="u" />]] as const).map(([key, label, icon]) => (
          <button
            key={key}
            type="button"
            className={`${styles.senderTab} ${senderTab === key ? styles.senderTabActive : ''}`}
            onClick={() => setSenderTab(key as 'all' | SenderType)}
          >
            {icon} {label}
            <span className={styles.senderTabCount}>{senderCounts[key as keyof typeof senderCounts]}</span>
          </button>
        ))}
      </div>

      {/* ステータスフィルター + 検索 */}
      <div className={styles.filterBar}>
        {(['all', 'open', 'in_progress', 'closed'] as StatusFilter[]).map((f) => (
          <button
            key={f}
            type="button"
            className={`${styles.filterBtn} ${statusFilter === f ? styles.filterBtnActive : ''}`}
            onClick={() => setStatusFilter(f)}
          >
            {f === 'all' ? 'すべて' : STATUS_LABELS[f]}
          </button>
        ))}
        <div className={styles.searchWrap}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="件名・送信者・メール・カテゴリで検索..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* 一覧 */}
      {filtered.length === 0 ? (
        <p className={styles.emptyMessage}>該当するお問い合わせがありません</p>
      ) : (
        <div className={styles.inquiryList}>
          {filtered.map((inq) => (
            <div key={inq.id} className={styles.inquiryCard} onClick={() => openDetail(inq)}>
              <div className={styles.inquiryMain}>
                <span className={styles.inquirySubject}>{inq.subject}</span>
                <div className={styles.inquiryMeta}>
                  <span><FiUser /> {inq.senderName}</span>
                  <span className={styles.categoryChip}><FiTag /> {inq.category}</span>
                  <span className={`${styles.senderTypeBadge} ${styles[`sender_${inq.senderType}`]}`}>
                    {inq.senderType === 'corporate' ? <FiBriefcase /> : <FiUsers />}
                    {SENDER_TYPE_LABELS[inq.senderType]}
                  </span>
                </div>
              </div>
              <span className={`${styles.statusBadge} ${styles[`status_${inq.status}`]}`}>
                {STATUS_LABELS[inq.status]}
              </span>
              <span className={styles.dateText}>
                {new Date(inq.createdAt).toLocaleDateString('ja-JP')}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* 詳細モーダル */}
      {selected && (
        <div className={styles.modalOverlay} onClick={() => setSelected(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>{selected.subject}</h3>
            <span className={styles.modalCategory}><FiTag /> {selected.category}</span>
            <div className={styles.modalMeta}>
              <span><FiUser /> {selected.senderName}</span>
              <span><FiMail /> {selected.senderEmail}</span>
              <span><FiCalendar /> {new Date(selected.createdAt).toLocaleString('ja-JP')}</span>
              <span className={`${styles.senderTypeBadge} ${styles[`sender_${selected.senderType}`]}`}>
                {selected.senderType === 'corporate' ? <FiBriefcase /> : <FiUsers />}
                {SENDER_TYPE_LABELS[selected.senderType]}
              </span>
              <span className={`${styles.statusBadge} ${styles[`status_${selected.status}`]}`}>
                {STATUS_LABELS[selected.status]}
              </span>
            </div>
            <p className={styles.modalBody}>{selected.body}</p>

            {selected.status !== 'closed' && (
              <div className={styles.replySection}>
                <p className={styles.replySectionLabel}>運営者からの返信</p>
                <textarea
                  className={styles.replyTextarea}
                  placeholder="返信内容を入力..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
              </div>
            )}

            {selected.status === 'closed' && selected.reply && (
              <div className={styles.replySection}>
                <p className={styles.replySectionLabel}>返信内容（対応済み）</p>
                <p className={styles.modalBody}>{selected.reply}</p>
              </div>
            )}

            <div className={styles.modalActions}>
              <button type="button" className={styles.modalCancelBtn} onClick={() => setSelected(null)}>閉じる</button>
              {selected.status !== 'closed' && (
                <>
                  <button type="button" className={styles.replyBtn} onClick={handleReply} disabled={!replyText.trim()}>返信する</button>
                  <button type="button" className={styles.closeBtn} onClick={handleClose}>対応完了</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInquiriesScreen;
