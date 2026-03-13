/**
 * AdminUsersScreen
 * ─────────────────────────────────────────────
 * ユーザー一覧管理画面。
 * - 検索・ステータスフィルター
 * - ユーザーテーブル（MUI Table）
 * - 停止/復元アクション
 */

import React, { useState } from 'react';
import {
  FiSearch,
  FiUserPlus,
  FiEdit2,
  FiSlash,
  FiCheckCircle,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';
import { useAdminUsers } from '../hooks/useAdminUsers';
import styles from './AdminUsersScreen.module.css';

const STATUS_LABELS: Record<string, string> = {
  active: 'アクティブ',
  suspended: '停止中',
  pending: '未確認',
};

const ROLE_LABELS: Record<string, string> = {
  admin: '管理者',
  operator: 'オペレーター',
  user: 'ユーザー',
};

const AdminUsersScreen: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useAdminUsers({ search, status: statusFilter, page });

  const users = data?.items ?? [];
  const total = data?.total ?? 0;

  return (
    <div className={styles.page}>
      {/* ヘッダー操作バー */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <FiSearch className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="ユーザー名・メールで検索..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>

        <select
          className={styles.filterSelect}
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          aria-label="ステータスフィルター"
        >
          <option value="">すべてのステータス</option>
          <option value="active">アクティブ</option>
          <option value="suspended">停止中</option>
          <option value="pending">未確認</option>
        </select>

        <button type="button" className={styles.addButton}>
          <FiUserPlus />
          <span>ユーザー追加</span>
        </button>
      </div>

      {/* テーブル */}
      <div className={styles.tableCard}>
        <div className={styles.tableInfo}>
          <span className={styles.totalLabel}>
            {isLoading ? '読み込み中...' : `${total} 件`}
          </span>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ユーザーID</th>
                <th>名前 / ユーザー名</th>
                <th>メール</th>
                <th>Realm</th>
                <th>役割</th>
                <th>ステータス</th>
                <th>最終ログイン</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className={styles.emptyRow}>読み込み中...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={8} className={styles.emptyRow}>ユーザーが見つかりません</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td className={styles.mono}>{user.id}</td>
                    <td>
                      <div className={styles.userCell}>
                        <span className={styles.userAvatar}>{user.displayName.charAt(0)}</span>
                        <div>
                          <div className={styles.displayName}>{user.displayName}</div>
                          <div className={styles.username}>@{user.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className={styles.emailCell}>{user.email}</td>
                    <td>
                      <span className={styles.realmBadge}>{user.realm}</span>
                    </td>
                    <td>
                      <span className={`${styles.roleBadge} ${styles[`role_${user.role}`]}`}>
                        {ROLE_LABELS[user.role] ?? user.role}
                      </span>
                    </td>
                    <td>
                      <span className={`${styles.statusBadge} ${styles[`status_${user.status}`]}`}>
                        {STATUS_LABELS[user.status] ?? user.status}
                      </span>
                    </td>
                    <td className={styles.mono}>
                      {user.lastLoginAt
                        ? new Date(user.lastLoginAt).toLocaleDateString('ja-JP', {
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '−'}
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          type="button"
                          className={styles.actionBtn}
                          title="編集"
                          aria-label="編集"
                        >
                          <FiEdit2 />
                        </button>
                        {user.status === 'active' ? (
                          <button
                            type="button"
                            className={`${styles.actionBtn} ${styles.dangerBtn}`}
                            title="停止"
                            aria-label="停止"
                          >
                            <FiSlash />
                          </button>
                        ) : (
                          <button
                            type="button"
                            className={`${styles.actionBtn} ${styles.successBtn}`}
                            title="復元"
                            aria-label="復元"
                          >
                            <FiCheckCircle />
                          </button>
                        )}
                        <button
                          type="button"
                          className={`${styles.actionBtn} ${styles.deleteBtn}`}
                          title="削除"
                          aria-label="削除"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ページネーション */}
        <div className={styles.pagination}>
          <span className={styles.paginationInfo}>
            {total} 件中 {Math.min((page - 1) * 10 + 1, total)}〜{Math.min(page * 10, total)} 件表示
          </span>
          <div className={styles.paginationButtons}>
            <button
              type="button"
              className={styles.pageBtn}
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              aria-label="前のページ"
            >
              <FiChevronLeft />
            </button>
            <span className={styles.pageNum}>{page}</span>
            <button
              type="button"
              className={styles.pageBtn}
              disabled={page * 10 >= total}
              onClick={() => setPage((p) => p + 1)}
              aria-label="次のページ"
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersScreen;
