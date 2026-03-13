/**
 * AdminAuthLogsScreen
 * ─────────────────────────────────────────────
 * 認証ログ一覧画面。
 * - ステータス / 認証方式フィルター
 * - 日時範囲フィルター
 * - ログテーブル
 * - CSV エクスポート（UI のみ）
 */

import React, { useState } from 'react';
import {
  FiDownload,
  FiFilter,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';
import styles from './AdminAuthLogsScreen.module.css';

// モックログデータ
const MOCK_LOGS = [
  { id: 'log001', userId: 'u001', username: 'tanaka_taro',     authMethod: 'cookie' as const, ipAddress: '192.168.1.10',  status: 'success' as const, createdAt: '2026-03-13T08:30:12Z', userAgent: 'Chrome/120' },
  { id: 'log002', userId: 'u007', username: 'kobayashi_shun',  authMethod: 'token'  as const, ipAddress: '203.0.113.5',   status: 'success' as const, createdAt: '2026-03-13T06:02:44Z', userAgent: 'Firefox/118' },
  { id: 'log003', userId: '',     username: '不明',             authMethod: 'token'  as const, ipAddress: '198.51.100.14', status: 'failure' as const, createdAt: '2026-03-13T05:50:33Z', userAgent: 'curl/7.68' },
  { id: 'log004', userId: 'u010', username: 'nakamura_akane',  authMethod: 'cookie' as const, ipAddress: '192.168.2.45',  status: 'success' as const, createdAt: '2026-03-13T05:31:05Z', userAgent: 'Safari/17' },
  { id: 'log005', userId: 'u003', username: 'suzuki_kenji',    authMethod: 'token'  as const, ipAddress: '10.0.0.3',      status: 'timeout' as const, createdAt: '2026-03-13T04:22:18Z', userAgent: 'Chrome/120' },
  { id: 'log006', userId: 'u005', username: 'ito_ryota',       authMethod: 'cookie' as const, ipAddress: '172.16.0.5',    status: 'success' as const, createdAt: '2026-03-12T18:44:00Z', userAgent: 'Chrome/120' },
  { id: 'log007', userId: '',     username: '不明',             authMethod: 'token'  as const, ipAddress: '45.33.32.156',  status: 'failure' as const, createdAt: '2026-03-12T17:10:22Z', userAgent: 'python-requests/2.28' },
  { id: 'log008', userId: 'u002', username: 'yamada_hanako',   authMethod: 'cookie' as const, ipAddress: '192.168.1.22',  status: 'success' as const, createdAt: '2026-03-12T14:20:55Z', userAgent: 'Safari/17' },
  { id: 'log009', userId: 'u009', username: 'yoshida_daisuke', authMethod: 'cookie' as const, ipAddress: '10.0.0.8',      status: 'success' as const, createdAt: '2026-03-12T12:45:01Z', userAgent: 'Edge/120' },
  { id: 'log010', userId: 'u006', username: 'watanabe_mai',    authMethod: 'token'  as const, ipAddress: '203.0.113.22',  status: 'success' as const, createdAt: '2026-03-12T09:30:40Z', userAgent: 'Chrome/120' },
  { id: 'log011', userId: '',     username: '不明',             authMethod: 'token'  as const, ipAddress: '185.220.101.1', status: 'failure' as const, createdAt: '2026-03-11T22:15:08Z', userAgent: 'Wget/1.21' },
  { id: 'log012', userId: 'u003', username: 'suzuki_kenji',    authMethod: 'cookie' as const, ipAddress: '10.0.0.3',      status: 'success' as const, createdAt: '2026-03-11T12:00:00Z', userAgent: 'Chrome/120' },
];

const STATUS_LABELS: Record<string, string> = {
  success: '成功',
  failure: '失敗',
  timeout: 'タイムアウト',
};

const AUTH_METHOD_LABELS: Record<string, string> = {
  cookie: 'Cookie',
  token: 'Token',
};

const PER_PAGE = 10;

const AdminAuthLogsScreen: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [page, setPage] = useState(1);

  // フィルタリング
  let filtered = MOCK_LOGS;
  if (statusFilter) filtered = filtered.filter((l) => l.status === statusFilter);
  if (methodFilter) filtered = filtered.filter((l) => l.authMethod === methodFilter);

  const total = filtered.length;
  const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleExport = () => {
    // TODO: 実際のエクスポート処理
    alert('CSVエクスポート機能は実装予定です');
  };

  return (
    <div className={styles.page}>
      {/* ツールバー */}
      <div className={styles.toolbar}>
        <div className={styles.filters}>
          <FiFilter className={styles.filterIcon} />

          <select
            className={styles.filterSelect}
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            aria-label="ステータスフィルター"
          >
            <option value="">すべてのステータス</option>
            <option value="success">成功</option>
            <option value="failure">失敗</option>
            <option value="timeout">タイムアウト</option>
          </select>

          <select
            className={styles.filterSelect}
            value={methodFilter}
            onChange={(e) => { setMethodFilter(e.target.value); setPage(1); }}
            aria-label="認証方式フィルター"
          >
            <option value="">すべての認証方式</option>
            <option value="cookie">Cookie認証</option>
            <option value="token">Token認証</option>
          </select>

          <button
            type="button"
            className={styles.resetBtn}
            onClick={() => { setStatusFilter(''); setMethodFilter(''); setPage(1); }}
            aria-label="フィルターリセット"
          >
            <FiRefreshCw />
            <span>リセット</span>
          </button>
        </div>

        <button type="button" className={styles.exportButton} onClick={handleExport}>
          <FiDownload />
          <span>CSVエクスポート</span>
        </button>
      </div>

      {/* テーブル */}
      <div className={styles.tableCard}>
        <div className={styles.tableInfo}>
          <span className={styles.totalLabel}>{total} 件のログ</span>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ログID</th>
                <th>ユーザー名</th>
                <th>認証方式</th>
                <th>IPアドレス</th>
                <th>ステータス</th>
                <th>日時</th>
                <th>ユーザーエージェント</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className={styles.emptyRow}>ログが見つかりません</td>
                </tr>
              ) : (
                pageItems.map((log) => (
                  <tr key={log.id}>
                    <td className={styles.mono}>{log.id}</td>
                    <td>
                      <span className={log.userId ? styles.knownUser : styles.unknownUser}>
                        {log.username}
                      </span>
                    </td>
                    <td>
                      <span className={`${styles.methodBadge} ${styles[`method_${log.authMethod}`]}`}>
                        {AUTH_METHOD_LABELS[log.authMethod]}
                      </span>
                    </td>
                    <td className={styles.mono}>{log.ipAddress}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${styles[`status_${log.status}`]}`}>
                        {STATUS_LABELS[log.status]}
                      </span>
                    </td>
                    <td className={styles.mono}>
                      {new Date(log.createdAt).toLocaleString('ja-JP', {
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                    <td className={styles.uaCell}>{log.userAgent}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ページネーション */}
        <div className={styles.pagination}>
          <span className={styles.paginationInfo}>
            {total} 件中 {total === 0 ? 0 : Math.min((page - 1) * PER_PAGE + 1, total)}〜
            {Math.min(page * PER_PAGE, total)} 件表示
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
            <span className={styles.pageNum}>{page} / {Math.max(1, Math.ceil(total / PER_PAGE))}</span>
            <button
              type="button"
              className={styles.pageBtn}
              disabled={page * PER_PAGE >= total}
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

export default AdminAuthLogsScreen;
