/**
 * AdminOperatorsScreen
 * ─────────────────────────────────────────────
 * オペレーター管理画面。
 * operator-root を特別表示。
 * カード形式で権限レベルを明示。
 */

import React from 'react';
import {
  FiShield,
  FiUser,
  FiEdit2,
  FiPlusCircle,
  FiClock,
  FiKey,
} from 'react-icons/fi';
import styles from './AdminOperatorsScreen.module.css';

// モックオペレーターデータ
const MOCK_OPERATORS = [
  {
    id: 'operator-root',
    username: 'operator-root',
    displayName: 'Root Operator',
    email: 'root@eventpick.admin',
    permissionLevel: 'root' as const,
    status: 'active' as const,
    createdAt: '2023-01-01T00:00:00Z',
    lastLoginAt: '2026-03-13T09:00:00Z',
    permissions: ['全権限'],
  },
  {
    id: 'op001',
    username: 'ops_suzuki',
    displayName: '鈴木 一郎',
    email: 'suzuki.ops@eventpick.admin',
    permissionLevel: 'super' as const,
    status: 'active' as const,
    createdAt: '2023-06-15T09:00:00Z',
    lastLoginAt: '2026-03-12T15:30:00Z',
    permissions: ['ユーザー管理', 'コンテンツ管理', 'ログ閲覧'],
  },
  {
    id: 'op002',
    username: 'ops_tanaka',
    displayName: '田中 美咲',
    email: 'tanaka.ops@eventpick.admin',
    permissionLevel: 'super' as const,
    status: 'active' as const,
    createdAt: '2023-09-20T10:00:00Z',
    lastLoginAt: '2026-03-11T11:00:00Z',
    permissions: ['ユーザー管理', 'コンテンツ管理', 'ログ閲覧'],
  },
  {
    id: 'op003',
    username: 'ops_ito',
    displayName: '伊藤 健',
    email: 'ito.ops@eventpick.admin',
    permissionLevel: 'standard' as const,
    status: 'active' as const,
    createdAt: '2024-01-10T09:00:00Z',
    lastLoginAt: '2026-03-10T14:00:00Z',
    permissions: ['ログ閲覧'],
  },
  {
    id: 'op004',
    username: 'ops_kato',
    displayName: '加藤 里奈',
    email: 'kato.ops@eventpick.admin',
    permissionLevel: 'standard' as const,
    status: 'inactive' as const,
    createdAt: '2024-03-01T09:00:00Z',
    lastLoginAt: '2025-12-15T10:00:00Z',
    permissions: ['ログ閲覧'],
  },
];

const LEVEL_LABELS: Record<string, string> = {
  root: 'Root',
  super: 'Super',
  standard: 'Standard',
};

const AdminOperatorsScreen: React.FC = () => {
  const rootOp = MOCK_OPERATORS.find((op) => op.permissionLevel === 'root');
  const others = MOCK_OPERATORS.filter((op) => op.permissionLevel !== 'root');

  return (
    <div className={styles.page}>
      {/* Root オペレーター特別カード */}
      {rootOp && (
        <section>
          <h2 className={styles.sectionTitle}>Root オペレーター</h2>
          <div className={styles.rootCard}>
            <div className={styles.rootIconWrap}>
              <FiKey className={styles.rootIcon} />
            </div>
            <div className={styles.rootInfo}>
              <div className={styles.rootName}>{rootOp.displayName}</div>
              <div className={styles.rootUsername}>@{rootOp.username}</div>
              <div className={styles.rootEmail}>{rootOp.email}</div>
            </div>
            <div className={styles.rootMeta}>
              <span className={styles.levelBadge} data-level="root">
                <FiShield /> Root 権限
              </span>
              <span className={styles.statusBadge} data-status={rootOp.status}>
                {rootOp.status === 'active' ? 'アクティブ' : '停止中'}
              </span>
            </div>
            <div className={styles.rootLastLogin}>
              <FiClock className={styles.metaIcon} />
              <span>
                最終ログイン:{' '}
                {rootOp.lastLoginAt
                  ? new Date(rootOp.lastLoginAt).toLocaleString('ja-JP', {
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : '−'}
              </span>
            </div>
          </div>
        </section>
      )}

      {/* オペレーター一覧 */}
      <section>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>オペレーター一覧</h2>
          <button type="button" className={styles.addButton}>
            <FiPlusCircle />
            <span>オペレーター追加</span>
          </button>
        </div>

        <div className={styles.cardsGrid}>
          {others.map((op) => (
            <div key={op.id} className={`${styles.opCard} ${op.status === 'inactive' ? styles.opCardInactive : ''}`}>
              {/* カードヘッダー */}
              <div className={styles.opCardHeader}>
                <div className={styles.opAvatar}>
                  <FiUser />
                </div>
                <div className={styles.opHeaderInfo}>
                  <div className={styles.opName}>{op.displayName}</div>
                  <div className={styles.opUsername}>@{op.username}</div>
                </div>
                <button type="button" className={styles.editBtn} title="編集" aria-label="編集">
                  <FiEdit2 />
                </button>
              </div>

              {/* 権限レベル */}
              <div className={styles.opMeta}>
                <span className={styles.levelBadge} data-level={op.permissionLevel}>
                  <FiShield /> {LEVEL_LABELS[op.permissionLevel]}
                </span>
                <span className={styles.statusBadge} data-status={op.status}>
                  {op.status === 'active' ? 'アクティブ' : '停止中'}
                </span>
              </div>

              {/* 権限リスト */}
              <div className={styles.permissionList}>
                {op.permissions.map((perm) => (
                  <span key={perm} className={styles.permChip}>{perm}</span>
                ))}
              </div>

              {/* メタ情報 */}
              <div className={styles.opFooter}>
                <span className={styles.opFooterItem}>
                  <FiClock className={styles.metaIcon} />
                  {op.lastLoginAt
                    ? new Date(op.lastLoginAt).toLocaleDateString('ja-JP', {
                        month: '2-digit',
                        day: '2-digit',
                      })
                    : '未ログイン'}
                </span>
                <span className={styles.opEmail}>{op.email}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminOperatorsScreen;
