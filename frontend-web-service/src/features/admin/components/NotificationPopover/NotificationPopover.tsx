/**
 * NotificationPopover
 * ─────────────────────────────────────────────
 * 運営管理画面トップバーのベルアイコンから表示する通知一覧ポップオーバー。
 * モックデータで通知を表示し、既読/未読の状態管理を行う。
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  FiBell,
  FiCheck,
  FiCheckCircle,
  FiAlertCircle,
  FiInfo,
  FiUserPlus,
  FiMessageSquare,
  FiFileText,
  FiX,
} from 'react-icons/fi';
import styles from './NotificationPopover.module.css';

/* ─── 通知型定義 ─── */
interface AdminNotification {
  id: string;
  type: 'review' | 'inquiry' | 'system' | 'account' | 'alert';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

/* ─── モック通知データ ─── */
const MOCK_NOTIFICATIONS: AdminNotification[] = [
  {
    id: 'n1',
    type: 'review',
    title: '新規審査申請',
    message: '株式会社サンプルコーポレーションから法人登録の審査申請が届きました。',
    isRead: false,
    createdAt: '2026-03-14T10:30:00',
  },
  {
    id: 'n2',
    type: 'inquiry',
    title: '新規お問い合わせ',
    message: 'イベント作成に関するお問い合わせが届いています。',
    isRead: false,
    createdAt: '2026-03-14T09:15:00',
  },
  {
    id: 'n3',
    type: 'alert',
    title: 'セキュリティアラート',
    message: '管理アカウントへのログイン試行が5回失敗しました。',
    isRead: false,
    createdAt: '2026-03-14T08:45:00',
  },
  {
    id: 'n4',
    type: 'account',
    title: '新規アカウント登録',
    message: '新しい消費者アカウントが12件登録されました。',
    isRead: true,
    createdAt: '2026-03-13T18:00:00',
  },
  {
    id: 'n5',
    type: 'system',
    title: 'システムレポート',
    message: 'ウィークリーレポートが生成されました。ダッシュボードで確認できます。',
    isRead: true,
    createdAt: '2026-03-13T09:00:00',
  },
  {
    id: 'n6',
    type: 'review',
    title: '審査完了通知',
    message: '株式会社テスト企画の審査が承認されました。',
    isRead: true,
    createdAt: '2026-03-12T16:20:00',
  },
];

/* ─── 通知タイプ → アイコン ─── */
const TYPE_ICON: Record<AdminNotification['type'], React.ReactNode> = {
  review: <FiFileText />,
  inquiry: <FiMessageSquare />,
  system: <FiInfo />,
  account: <FiUserPlus />,
  alert: <FiAlertCircle />,
};

const TYPE_COLOR: Record<AdminNotification['type'], string> = {
  review: '#6366f1',
  inquiry: '#0ea5e9',
  system: '#8b5cf6',
  account: '#22c55e',
  alert: '#f59e0b',
};

/* ─── 相対時間フォーマット ─── */
function formatRelativeTime(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return 'たった今';
  if (diffMin < 60) return `${diffMin}分前`;
  if (diffHour < 24) return `${diffHour}時間前`;
  if (diffDay < 7) return `${diffDay}日前`;
  return new Date(dateStr).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
}

/* ─── コンポーネント ─── */
const NotificationPopover: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AdminNotification[]>(MOCK_NOTIFICATIONS);
  const popoverRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  /* クリック外で閉じる */
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  /* ESC で閉じる */
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleMarkAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  }, []);

  const handleMarkAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  return (
    <div className={styles.wrapper} ref={popoverRef}>
      {/* ベルボタン */}
      <button
        type="button"
        className={styles.bellButton}
        onClick={handleToggle}
        aria-label="通知"
        aria-expanded={isOpen}
      >
        <FiBell />
        {unreadCount > 0 && (
          <span className={styles.badge} aria-hidden>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* ポップオーバー */}
      {isOpen && (
        <div className={styles.popover} role="dialog" aria-label="通知一覧">
          {/* ヘッダー */}
          <div className={styles.popoverHeader}>
            <h3 className={styles.popoverTitle}>通知</h3>
            <div className={styles.popoverActions}>
              {unreadCount > 0 && (
                <button
                  type="button"
                  className={styles.markAllBtn}
                  onClick={handleMarkAllRead}
                >
                  <FiCheck size={13} />
                  すべて既読
                </button>
              )}
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setIsOpen(false)}
                aria-label="閉じる"
              >
                <FiX />
              </button>
            </div>
          </div>

          {/* 通知リスト */}
          <div className={styles.list}>
            {notifications.length === 0 ? (
              <div className={styles.empty}>
                <FiCheckCircle size={28} />
                <p>通知はありません</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <button
                  key={notif.id}
                  type="button"
                  className={`${styles.item} ${!notif.isRead ? styles.itemUnread : ''}`}
                  onClick={() => handleMarkAsRead(notif.id)}
                >
                  <div
                    className={styles.itemIcon}
                    style={{ background: `${TYPE_COLOR[notif.type]}18`, color: TYPE_COLOR[notif.type] }}
                  >
                    {TYPE_ICON[notif.type]}
                  </div>
                  <div className={styles.itemBody}>
                    <div className={styles.itemTitleRow}>
                      <span className={styles.itemTitle}>{notif.title}</span>
                      <span className={styles.itemTime}>{formatRelativeTime(notif.createdAt)}</span>
                    </div>
                    <p className={styles.itemMessage}>{notif.message}</p>
                  </div>
                  {!notif.isRead && <span className={styles.unreadDot} aria-label="未読" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPopover;
