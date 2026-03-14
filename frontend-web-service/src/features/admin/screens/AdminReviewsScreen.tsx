/**
 * AdminReviewsScreen（刷新版）
 * ─────────────────────────────────────────────
 * テーブルベースのUI + タブフィルター + サマリーKPI
 */

import React, { useState, useMemo } from 'react';
import {
  FiSearch,
  FiCheck,
  FiX,
  FiFileText,
  FiUser,
  FiClock,
  FiMail,
  FiAlertCircle,
  FiCheckCircle,
  FiXCircle,
  FiDownload,
  FiExternalLink,
} from 'react-icons/fi';
import styles from './AdminReviewsScreen.module.css';
import type { ReviewScreenStatus, ReviewApplication } from '../types/admin';
import { useFormValidation } from '../../../lib/useFormValidation';
import { adminReviewRejectFormSchema } from '../../../lib/formSchemas';

// ──────── モックデータ ────────
const MOCK_REVIEWS: ReviewApplication[] = [
  { id: 'rv001', corporateCode: 'CORP-001', companyName: '株式会社イベントプロ', representativeName: '田中 一郎', address: '東京都渋谷区道玄坂1-2-3', notifyEmail: 'tanaka@eventpro.co.jp', registryDocUrl: '/mock/docs/registry_rv001.pdf', submittedAt: '2026-03-10T09:00:00Z', status: 'pending' },
  { id: 'rv002', corporateCode: 'CORP-002', companyName: '合同会社フェスタ', representativeName: '佐々木 美咲', address: '愛知県名古屋市中区栄4-5-6', notifyEmail: 'sasaki@festa.jp', registryDocUrl: '/mock/docs/registry_rv002.pdf', submittedAt: '2026-03-08T14:00:00Z', status: 'pending' },
  { id: 'rv003', corporateCode: 'CORP-003', companyName: '株式会社パーティタイム', representativeName: '小川 翔太', address: '福岡県福岡市博多区博多駅前7-8-9', notifyEmail: 'ogawa@partytime.co.jp', registryDocUrl: '/mock/docs/registry_rv003.pdf', submittedAt: '2026-03-05T10:30:00Z', status: 'approved' },
  { id: 'rv004', corporateCode: 'CORP-004', companyName: '株式会社セレブレーション', representativeName: '松田 裕子', address: '神奈川県横浜市西区みなとみらい10-11-12', notifyEmail: 'matsuda@celebration.co.jp', registryDocUrl: '/mock/docs/registry_rv004.pdf', submittedAt: '2026-03-03T11:00:00Z', status: 'approved' },
  { id: 'rv005', corporateCode: 'CORP-005', companyName: '有限会社ナイトクラブXYZ', representativeName: '渡辺 剛', address: '大阪府大阪市中央区心斎橋筋13-14', notifyEmail: 'watanabe@nightxyz.com', registryDocUrl: '/mock/docs/registry_rv005.pdf', submittedAt: '2026-02-28T16:00:00Z', status: 'rejected', rejectionReason: '提出された登記簿の内容と申請情報が一致しません。再提出をお願いします。' },
  { id: 'rv006', corporateCode: 'CORP-006', companyName: '株式会社グランドイベント', representativeName: '渡部 真紀', address: '広島県広島市中区基町15-16', notifyEmail: 'watabe@grandevent.co.jp', registryDocUrl: '/mock/docs/registry_rv006.pdf', submittedAt: '2026-03-12T08:00:00Z', status: 'pending' },
  { id: 'rv007', corporateCode: 'CORP-007', companyName: '合同会社マルシェサポート', representativeName: '高田 恵', address: '北海道札幌市中央区大通西17-18', notifyEmail: 'takada@marchesupport.jp', registryDocUrl: '/mock/docs/registry_rv007.pdf', submittedAt: '2026-03-11T13:00:00Z', status: 'pending' },
];

const STATUS_LABELS: Record<ReviewScreenStatus, string> = { pending: '未承認', approved: '承認済', rejected: '却下' };
type FilterType = 'all' | ReviewScreenStatus;

const AdminReviewsScreen: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewApplication[]>(MOCK_REVIEWS);
  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');

  const [approveTarget, setApproveTarget] = useState<ReviewApplication | null>(null);
  const [rejectTarget, setRejectTarget] = useState<ReviewApplication | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [detailTarget, setDetailTarget] = useState<ReviewApplication | null>(null);
  const { validate: validateReject } = useFormValidation(adminReviewRejectFormSchema);

  const summary = useMemo(() => ({
    pending: reviews.filter((r) => r.status === 'pending').length,
    approved: reviews.filter((r) => r.status === 'approved').length,
    rejected: reviews.filter((r) => r.status === 'rejected').length,
  }), [reviews]);

  const filtered = useMemo(() => {
    let result = reviews;
    if (filter !== 'all') result = result.filter((r) => r.status === filter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((r) =>
        r.companyName.toLowerCase().includes(q) ||
        r.representativeName.toLowerCase().includes(q) ||
        r.corporateCode.toLowerCase().includes(q),
      );
    }
    return result;
  }, [reviews, filter, search]);

  const handleApprove = () => {
    if (!approveTarget) return;
    setReviews((prev) => prev.map((r) => r.id === approveTarget.id ? { ...r, status: 'approved' as const } : r));
    setApproveTarget(null);
  };

  const handleReject = () => {
    if (!rejectTarget) return;
    const result = validateReject({ rejectReason });
    if (!result.success) return;
    setReviews((prev) => prev.map((r) => r.id === rejectTarget.id ? { ...r, status: 'rejected' as const, rejectionReason: rejectReason.trim() } : r));
    setRejectTarget(null);
    setRejectReason('');
  };

  return (
    <div className={styles.page}>
      {/* ── サマリーKPI ── */}
      <section className={styles.summaryGrid}>
        <div
          className={`${styles.summaryCard} ${filter === 'pending' ? styles.summaryCardActive : ''}`}
          onClick={() => setFilter(filter === 'pending' ? 'all' : 'pending')}
        >
          <div className={`${styles.summaryIcon} ${styles.iconPending}`}><FiAlertCircle /></div>
          <div className={styles.summaryContent}>
            <span className={styles.summaryLabel}>未承認</span>
            <span className={styles.summaryValue}>{summary.pending}</span>
          </div>
        </div>
        <div
          className={`${styles.summaryCard} ${filter === 'approved' ? styles.summaryCardActive : ''}`}
          onClick={() => setFilter(filter === 'approved' ? 'all' : 'approved')}
        >
          <div className={`${styles.summaryIcon} ${styles.iconApproved}`}><FiCheckCircle /></div>
          <div className={styles.summaryContent}>
            <span className={styles.summaryLabel}>承認済</span>
            <span className={styles.summaryValue}>{summary.approved}</span>
          </div>
        </div>
        <div
          className={`${styles.summaryCard} ${filter === 'rejected' ? styles.summaryCardActive : ''}`}
          onClick={() => setFilter(filter === 'rejected' ? 'all' : 'rejected')}
        >
          <div className={`${styles.summaryIcon} ${styles.iconRejected}`}><FiXCircle /></div>
          <div className={styles.summaryContent}>
            <span className={styles.summaryLabel}>却下</span>
            <span className={styles.summaryValue}>{summary.rejected}</span>
          </div>
        </div>
      </section>

      {/* ── タブ＋検索 ── */}
      <div className={styles.toolbarRow}>
        <div className={styles.tabBar}>
          {(['all', 'pending', 'approved', 'rejected'] as FilterType[]).map((f) => (
            <button
              key={f}
              type="button"
              className={`${styles.tabBtn} ${filter === f ? styles.tabBtnActive : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'すべて' : STATUS_LABELS[f]}
              <span className={`${styles.tabCount} ${
                f === 'all' ? styles.countAll
                : f === 'pending' ? styles.countPending
                : f === 'approved' ? styles.countApproved
                : styles.countRejected
              }`}>
                {f === 'all' ? reviews.length : summary[f]}
              </span>
            </button>
          ))}
        </div>
        <div className={styles.searchWrap}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="企業名・代表者名・法人コード..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ── テーブル ── */}
      <div className={styles.tableCard}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>企業情報</th>
                <th>法人コード</th>
                <th>申請日</th>
                <th>ステータス</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className={styles.emptyRow}>該当する審査申請がありません</td></tr>
              ) : filtered.map((rv) => (
                <tr key={rv.id}>
                  <td>
                    <div className={styles.companyCell}>
                      <span className={styles.companyName}>{rv.companyName}</span>
                      <span className={styles.companyDetail}>
                        <FiUser /> {rv.representativeName}
                      </span>
                    </div>
                  </td>
                  <td>{rv.corporateCode}</td>
                  <td>
                    <span className={styles.dateText}>
                      {new Date(rv.submittedAt).toLocaleDateString('ja-JP')}
                    </span>
                  </td>
                  <td>
                    <span className={`${styles.statusBadge} ${styles[`status_${rv.status}`]}`}>
                      <span className={`${styles.statusDot} ${styles[`dot${rv.status.charAt(0).toUpperCase()}${rv.status.slice(1)}`]}`} />
                      {STATUS_LABELS[rv.status]}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actionGroup}>
                      <button type="button" className={styles.docBtn} onClick={() => setDetailTarget(rv)}>
                        <FiFileText /> 詳細
                      </button>
                      {rv.status === 'pending' && (
                        <>
                          <button type="button" className={styles.approveBtn} onClick={() => setApproveTarget(rv)}>
                            <FiCheck /> 承認
                          </button>
                          <button type="button" className={styles.rejectBtn} onClick={() => setRejectTarget(rv)}>
                            <FiX /> 却下
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── 詳細モーダル ── */}
      {detailTarget && (
        <div className={styles.modalOverlay} onClick={() => setDetailTarget(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>企業登録審査情報</h3>
            <div className={styles.detailGrid}>
              <span className={styles.detailLabel}>法人コード</span>
              <span className={styles.detailValue}>{detailTarget.corporateCode}</span>
              <span className={styles.detailLabel}>会社名</span>
              <span className={styles.detailValue}>{detailTarget.companyName}</span>
              <span className={styles.detailLabel}>代表者名</span>
              <span className={styles.detailValue}>{detailTarget.representativeName}</span>
              <span className={styles.detailLabel}>会社住所</span>
              <span className={styles.detailValue}>{detailTarget.address}</span>
              <span className={styles.detailLabel}><FiMail /> 審査結果通知用メール</span>
              <span className={styles.detailValue}>{detailTarget.notifyEmail}</span>
              <span className={styles.detailLabel}><FiClock /> 申請日</span>
              <span className={styles.detailValue}>{new Date(detailTarget.submittedAt).toLocaleDateString('ja-JP')}</span>
              <span className={styles.detailLabel}>ステータス</span>
              <span className={styles.detailValue}>{STATUS_LABELS[detailTarget.status]}</span>
              {detailTarget.rejectionReason && (
                <>
                  <span className={styles.detailLabel}>却下理由</span>
                  <span className={styles.detailValue}>{detailTarget.rejectionReason}</span>
                </>
              )}
            </div>
            <div className={styles.registryDocSection}>
              <span className={styles.detailLabel}><FiFileText /> 登記簿謄本</span>
              <div className={styles.registryDocActions}>
                <a
                  href={detailTarget.registryDocUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.registryDocBtn}
                >
                  <FiExternalLink /> 登記簿を確認する
                </a>
                <a
                  href={detailTarget.registryDocUrl}
                  download
                  className={styles.registryDocDownloadBtn}
                >
                  <FiDownload /> ダウンロード
                </a>
              </div>
            </div>
            <div className={styles.modalActions}>
              <button type="button" className={styles.modalCancelBtn} onClick={() => setDetailTarget(null)}>閉じる</button>
            </div>
          </div>
        </div>
      )}

      {/* ── 承認確認モーダル ── */}
      {approveTarget && (
        <div className={styles.modalOverlay} onClick={() => setApproveTarget(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>審査承認</h3>
            <p className={styles.modalBody}>
              「{approveTarget.companyName}」の登録審査を承認しますか？<br />
              承認後、企業アカウントが有効化されます。
            </p>
            <div className={styles.modalActions}>
              <button type="button" className={styles.modalCancelBtn} onClick={() => setApproveTarget(null)}>キャンセル</button>
              <button type="button" className={styles.modalApproveBtn} onClick={handleApprove}>承認する</button>
            </div>
          </div>
        </div>
      )}

      {/* ── 却下確認モーダル ── */}
      {rejectTarget && (
        <div className={styles.modalOverlay} onClick={() => { setRejectTarget(null); setRejectReason(''); }}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>審査却下</h3>
            <p className={styles.modalBody}>
              「{rejectTarget.companyName}」の登録審査を却下します。<br />却下理由を入力してください。
            </p>
            <textarea
              className={styles.rejectReasonInput}
              placeholder="却下理由を入力..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className={styles.modalActions}>
              <button type="button" className={styles.modalCancelBtn} onClick={() => { setRejectTarget(null); setRejectReason(''); }}>キャンセル</button>
              <button type="button" className={styles.modalRejectBtn} onClick={handleReject} disabled={!rejectReason.trim()}>却下する</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReviewsScreen;
