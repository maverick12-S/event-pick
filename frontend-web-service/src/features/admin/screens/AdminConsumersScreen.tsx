/**
 * AdminConsumersScreen
 * ─────────────────────────────────────────────
 * 一般消費者アカウント一覧画面。
 * - 初期表示は検索バーのみ
 * - 検索実行後にアカウント情報テーブルを表示
 * - アカウント停止 / 削除予定のアクション
 */

import React, { useState } from 'react';
import {
  FiSearch,
  FiSlash,
  FiCheckCircle,
  FiCalendar,
  FiXCircle,
} from 'react-icons/fi';
import { useAdminConsumers } from '../hooks/useAdminConsumers';
import styles from './AdminConsumersScreen.module.css';

const STATUS_LABELS: Record<string, string> = {
  active: 'アクティブ',
  suspended: '停止中',
  delete_scheduled: '削除予定',
};

const AdminConsumersScreen: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // モーダル制御
  const [suspendTarget, setSuspendTarget] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleteDate, setDeleteDate] = useState('');

  const { data, isLoading } = useAdminConsumers({
    search: searchQuery,
    enabled: hasSearched,
  });

  const consumers = data?.items ?? [];
  const total = data?.total ?? 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(inputValue);
    setHasSearched(true);
  };

  const handleClear = () => {
    setInputValue('');
    setSearchQuery('');
    setHasSearched(false);
  };

  const handleSuspendConfirm = () => {
    // TODO: API呼び出し
    setSuspendTarget(null);
  };

  const handleDeleteConfirm = () => {
    // TODO: API呼び出し (deleteScheduledAt = deleteDate)
    setDeleteTarget(null);
    setDeleteDate('');
  };

  return (
    <div className={styles.page}>
      {/* ── 検索エリア ── */}
      <div className={`${styles.searchArea} ${hasSearched ? styles.compact : ''}`}>
        <h2 className={`${styles.searchTitle} ${hasSearched ? styles.hidden : ''}`}>
          消費者アカウント検索
        </h2>

        <form className={styles.searchForm} onSubmit={handleSearch}>
          <div className={styles.searchWrap}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="名前・ユーザー名・メール・電話番号で検索..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
          <button type="submit" className={styles.searchBtn}>
            <FiSearch /> 検索
          </button>
        </form>

        <p className={`${styles.searchHint} ${hasSearched ? styles.hidden : ''}`}>
          検索条件を入力してアカウントを検索してください
        </p>
      </div>

      {/* ── 検索結果テーブル ── */}
      {hasSearched && (
        <div className={styles.tableCard}>
          <div className={styles.tableInfo}>
            <span className={styles.totalLabel}>
              {isLoading ? '検索中...' : `${total} 件`}
            </span>
            <button type="button" className={styles.clearBtn} onClick={handleClear}>
              検索をクリア
            </button>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>名前</th>
                  <th>メール</th>
                  <th>電話番号</th>
                  <th>ステータス</th>
                  <th>最終ログイン</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className={styles.emptyRow}>検索中...</td>
                  </tr>
                ) : consumers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className={styles.emptyRow}>該当するアカウントが見つかりません</td>
                  </tr>
                ) : (
                  consumers.map((c) => (
                    <tr key={c.id}>
                      <td className={styles.mono}>{c.id}</td>
                      <td>
                        <div className={styles.userCell}>
                          <span className={styles.userAvatar}>{c.displayName.charAt(0)}</span>
                          <div>
                            <div className={styles.displayName}>{c.displayName}</div>
                            <div className={styles.username}>@{c.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className={styles.mono}>{c.email}</td>
                      <td className={styles.mono}>{c.phone}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${styles[`status_${c.status}`]}`}>
                          {STATUS_LABELS[c.status] ?? c.status}
                        </span>
                        {c.deleteScheduledAt && (
                          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
                            {new Date(c.deleteScheduledAt).toLocaleDateString('ja-JP')} 削除
                          </div>
                        )}
                      </td>
                      <td className={styles.mono}>
                        {c.lastLoginAt
                          ? new Date(c.lastLoginAt).toLocaleDateString('ja-JP', {
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : '−'}
                      </td>
                      <td>
                        <div className={styles.actions}>
                          {c.status === 'active' ? (
                            <button
                              type="button"
                              className={`${styles.actionBtn} ${styles.suspendBtn}`}
                              title="アカウント停止"
                              onClick={() => setSuspendTarget(c.id)}
                            >
                              <FiSlash />
                            </button>
                          ) : c.status === 'suspended' ? (
                            <button
                              type="button"
                              className={`${styles.actionBtn} ${styles.restoreBtn}`}
                              title="停止解除"
                              onClick={() => {/* TODO: restore API */}}
                            >
                              <FiCheckCircle />
                            </button>
                          ) : null}

                          {c.status !== 'delete_scheduled' ? (
                            <button
                              type="button"
                              className={`${styles.actionBtn} ${styles.deleteBtn}`}
                              title="削除予定を設定"
                              onClick={() => setDeleteTarget(c.id)}
                            >
                              <FiCalendar />
                            </button>
                          ) : (
                            <button
                              type="button"
                              className={`${styles.actionBtn} ${styles.cancelBtn}`}
                              title="削除予定を取消"
                              onClick={() => {/* TODO: cancel delete API */}}
                            >
                              <FiXCircle />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── 停止確認モーダル ── */}
      {suspendTarget && (
        <div className={styles.modalOverlay} onClick={() => setSuspendTarget(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>アカウント停止</h3>
            <p className={styles.modalBody}>
              このアカウントを停止しますか？<br />
              停止中はログインできなくなります。
            </p>
            <div className={styles.modalActions}>
              <button type="button" className={styles.modalCancelBtn} onClick={() => setSuspendTarget(null)}>
                キャンセル
              </button>
              <button
                type="button"
                className={`${styles.modalConfirmBtn} ${styles.modalConfirmDanger}`}
                onClick={handleSuspendConfirm}
              >
                停止する
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 削除予定モーダル ── */}
      {deleteTarget && (
        <div className={styles.modalOverlay} onClick={() => { setDeleteTarget(null); setDeleteDate(''); }}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>削除予定日の設定</h3>
            <p className={styles.modalBody}>
              アカウントの削除予定日を指定してください。<br />
              予定日になると自動的に削除されます。
            </p>
            <input
              type="date"
              className={styles.modalDateInput}
              value={deleteDate}
              onChange={(e) => setDeleteDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
            <div className={styles.modalActions}>
              <button type="button" className={styles.modalCancelBtn} onClick={() => { setDeleteTarget(null); setDeleteDate(''); }}>
                キャンセル
              </button>
              <button
                type="button"
                className={styles.modalConfirmBtn}
                onClick={handleDeleteConfirm}
                disabled={!deleteDate}
              >
                設定する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminConsumersScreen;
