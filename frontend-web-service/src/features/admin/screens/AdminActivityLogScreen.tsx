/**
 * AdminActivityLogScreen
 * ─────────────────────────────────────────────
 * 実行履歴画面。通常ログイン時の実行履歴と同じ要素
 * （カテゴリ / タイトル / 説明 / 実行者 / 実行時間）で表示する。
 */

import React, { useState, useMemo } from 'react';
import {
  FiFilter,
  FiSearch,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';
import styles from './AdminActivityLogScreen.module.css';

// ──────── 型定義 ────────
type ActivityCategory = 'review' | 'account' | 'coupon' | 'category' | 'inquiry' | 'settings' | 'system';

interface ActivityEntry {
  id: string;
  category: ActivityCategory;
  title: string;
  description: string;
  actor: string;
  executedAt: string;
}

// ──────── モックデータ ────────
const CATEGORY_LABELS: Record<ActivityCategory, string> = {
  review: '審査',
  account: 'アカウント',
  coupon: 'クーポン',
  category: 'カテゴリ',
  inquiry: 'お問い合わせ',
  settings: '設定',
  system: 'システム',
};

const MOCK_ACTIVITIES: ActivityEntry[] = [
  { id: 'act001', category: 'review', title: '株式会社イベントプロの法人審査を承認', description: '提出済みの登記簿と登録内容を照合し、法人会員登録を承認しました。', actor: 'admin_tanaka', executedAt: '2026-03-13T10:15:00Z' },
  { id: 'act002', category: 'review', title: '有限会社ナイトクラブXYZの法人審査を却下', description: '登記簿記載内容と申請情報の不一致を確認したため、再提出依頼付きで却下しました。', actor: 'admin_tanaka', executedAt: '2026-03-13T10:05:00Z' },
  { id: 'act003', category: 'account', title: '消費者アカウントを停止', description: '対象ユーザー suzuki_hanako (u002) のアカウント状態を停止に更新しました。', actor: 'admin_sato', executedAt: '2026-03-13T09:30:00Z' },
  { id: 'act004', category: 'coupon', title: 'SPRING500 クーポンを発行', description: '500円引き、利用上限200回のクーポンを新規作成しました。', actor: 'admin_tanaka', executedAt: '2026-03-13T08:45:00Z' },
  { id: 'act005', category: 'category', title: 'カテゴリ「eスポーツ」を追加', description: 'イベントカテゴリ一覧に新規カテゴリを追加し、公開状態に設定しました。', actor: 'admin_sato', executedAt: '2026-03-12T17:20:00Z' },
  { id: 'act006', category: 'inquiry', title: 'お問い合わせ #inq002 に返信', description: 'クーポンコード適用不可のお問い合わせに対して調査中の返信を送信しました。', actor: 'admin_tanaka', executedAt: '2026-03-12T16:00:00Z' },
  { id: 'act007', category: 'account', title: '拠点アカウントを復元', description: '停止中だった nagoya_branch (ra003) の利用状態をアクティブへ戻しました。', actor: 'admin_sato', executedAt: '2026-03-12T14:10:00Z' },
  { id: 'act008', category: 'settings', title: 'メンテナンスモードを変更', description: '全体設定からメンテナンスモードを OFF に切り替え、公開運用を再開しました。', actor: 'admin_tanaka', executedAt: '2026-03-12T09:00:00Z' },
  { id: 'act009', category: 'review', title: '株式会社パーティタイムの法人審査を承認', description: '新規会員登録内容と登記簿を確認し、審査を完了しました。', actor: 'admin_tanaka', executedAt: '2026-03-11T15:30:00Z' },
  { id: 'act010', category: 'system', title: '運営アカウントがログイン', description: 'オペレーター admin_tanaka が管理画面へログインしました。', actor: 'admin_tanaka', executedAt: '2026-03-11T08:00:00Z' },
  { id: 'act011', category: 'coupon', title: 'NEWYEAR2026 クーポンを無効化', description: '利用期限切れに伴いクーポンを自動無効化し、配布対象から除外しました。', actor: 'admin_sato', executedAt: '2026-03-10T18:00:00Z' },
  { id: 'act012', category: 'category', title: 'カテゴリ「テスト」を削除', description: '未使用カテゴリを管理対象から削除しました。', actor: 'admin_sato', executedAt: '2026-03-10T12:00:00Z' },
  { id: 'act013', category: 'inquiry', title: 'お問い合わせ #inq004 を対応完了', description: '決済二重計上の修正完了を返信し、ステータスを完了へ更新しました。', actor: 'admin_tanaka', executedAt: '2026-03-10T11:00:00Z' },
  { id: 'act014', category: 'account', title: '消費者アカウントの削除予定を設定', description: 'watanabe_mai (u006) を 2026-04-10 に削除予定として登録しました。', actor: 'admin_sato', executedAt: '2026-03-09T16:00:00Z' },
  { id: 'act015', category: 'system', title: '運営アカウントがログイン', description: 'オペレーター admin_sato が管理画面へログインしました。', actor: 'admin_sato', executedAt: '2026-03-09T08:00:00Z' },
];

const PER_PAGE = 10;

const toDateInputValue = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const AdminActivityLogScreen: React.FC = () => {
  const [categoryFilter, setCategoryFilter] = useState('');
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = MOCK_ACTIVITIES;
    if (categoryFilter) result = result.filter((a) => a.category === categoryFilter);
    if (dateFilter) result = result.filter((a) => toDateInputValue(new Date(a.executedAt)) === dateFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((a) =>
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.actor.toLowerCase().includes(q) ||
        CATEGORY_LABELS[a.category].toLowerCase().includes(q),
      );
    }
    return result;
  }, [categoryFilter, dateFilter, search]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className={styles.page}>
      {/* ツールバー */}
      <div className={styles.toolbar}>
        <div className={styles.filters}>
          <FiFilter className={styles.filterIcon} />

          <select
            className={styles.filterSelect}
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
            aria-label="カテゴリフィルター"
          >
            <option value="">すべてのカテゴリ</option>
            {(Object.entries(CATEGORY_LABELS) as [ActivityCategory, string][]).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>

          <input
            type="date"
            className={styles.filterSelect}
            value={dateFilter}
            onChange={(e) => { setDateFilter(e.target.value); setPage(1); }}
            aria-label="日付フィルター"
          />

          <div className={styles.searchWrap}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="タイトル・説明・実行者・カテゴリで検索..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>

          <button
            type="button"
            className={styles.resetBtn}
            onClick={() => { setCategoryFilter(''); setDateFilter(''); setSearch(''); setPage(1); }}
          >
            <FiRefreshCw /> リセット
          </button>
        </div>
      </div>

      {/* テーブル */}
      <div className={styles.tableCard}>
        <div className={styles.tableInfo}>
          <span className={styles.totalLabel}>{total} 件の履歴</span>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>日時</th>
                <th>カテゴリ</th>
                <th>タイトル</th>
                <th>内容</th>
                <th>実行者</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className={styles.emptyRow}>該当する履歴がありません</td>
                </tr>
              ) : (
                pageItems.map((a) => (
                  <tr key={a.id}>
                    <td className={styles.mono}>
                      {new Date(a.executedAt).toLocaleString('ja-JP', {
                        month: '2-digit', day: '2-digit',
                        hour: '2-digit', minute: '2-digit', second: '2-digit',
                      })}
                    </td>
                    <td>
                      <span className={`${styles.categoryBadge} ${styles[`cat_${a.category}`]}`}>
                        {CATEGORY_LABELS[a.category]}
                      </span>
                    </td>
                    <td className={styles.titleCell}>{a.title}</td>
                    <td className={styles.detailCell}>{a.description}</td>
                    <td className={styles.mono}>{a.actor}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ページネーション */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              type="button"
              className={styles.pageBtn}
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <FiChevronLeft /> 前へ
            </button>
            <span className={styles.pageLabel}>{page} / {totalPages}</span>
            <button
              type="button"
              className={styles.pageBtn}
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              次へ <FiChevronRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminActivityLogScreen;
