/**
 * AdminCategoriesScreen
 * ─────────────────────────────────────────────
 * カテゴリ管理画面。カテゴリの追加・削除を行う。
 */

import React, { useState } from 'react';
import { FiPlus, FiTrash2, FiTag } from 'react-icons/fi';
import styles from './AdminCategoriesScreen.module.css';

interface Category {
  id: string;
  name: string;
  count: number;
  createdAt: string;
}

const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat01', name: '音楽フェス', count: 124, createdAt: '2024-01-15' },
  { id: 'cat02', name: 'フードイベント', count: 89, createdAt: '2024-01-15' },
  { id: 'cat03', name: 'セミナー・講演', count: 67, createdAt: '2024-02-01' },
  { id: 'cat04', name: 'スポーツ', count: 52, createdAt: '2024-02-10' },
  { id: 'cat05', name: 'アート・展示', count: 38, createdAt: '2024-03-01' },
  { id: 'cat06', name: 'キッズ・ファミリー', count: 45, createdAt: '2024-03-20' },
  { id: 'cat07', name: 'テクノロジー', count: 31, createdAt: '2024-04-15' },
  { id: 'cat08', name: '季節イベント', count: 76, createdAt: '2024-05-01' },
  { id: 'cat09', name: 'マーケット・フリマ', count: 58, createdAt: '2024-06-10' },
  { id: 'cat10', name: 'ワークショップ', count: 42, createdAt: '2024-07-01' },
];

const AdminCategoriesScreen: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [newName, setNewName] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed) return;
    const newCat: Category = {
      id: `cat_${Date.now()}`,
      name: trimmed,
      count: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCategories((prev) => [...prev, newCat]);
    setNewName('');
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div className={styles.page}>
      {/* ── 追加フォーム ── */}
      <div className={styles.addArea}>
        <form className={styles.addForm} onSubmit={handleAdd}>
          <input
            type="text"
            className={styles.addInput}
            placeholder="新しいカテゴリ名を入力..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            maxLength={30}
          />
          <button type="submit" className={styles.addBtn} disabled={!newName.trim()}>
            <FiPlus /> 追加
          </button>
        </form>
      </div>

      {/* ── カテゴリ一覧 ── */}
      <div className={styles.listCard}>
        <div className={styles.listHeader}>
          <h2 className={styles.listTitle}>カテゴリ一覧</h2>
          <span className={styles.countBadge}>{categories.length} 件</span>
        </div>

        {categories.length === 0 ? (
          <p className={styles.emptyMessage}>カテゴリがありません</p>
        ) : (
          <ul className={styles.categoryList}>
            {categories.map((cat) => (
              <li key={cat.id} className={styles.categoryItem}>
                <div className={styles.categoryInfo}>
                  <span className={styles.categoryIcon}><FiTag /></span>
                  <div>
                    <div className={styles.categoryName}>{cat.name}</div>
                    <div className={styles.categoryMeta}>
                      投稿数: {cat.count} ・ 作成日: {cat.createdAt}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className={styles.deleteBtn}
                  title="削除"
                  onClick={() => setDeleteTarget(cat)}
                >
                  <FiTrash2 />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ── 削除確認モーダル ── */}
      {deleteTarget && (
        <div className={styles.modalOverlay} onClick={() => setDeleteTarget(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>カテゴリ削除</h3>
            <p className={styles.modalBody}>
              「{deleteTarget.name}」を削除しますか？<br />
              このカテゴリに紐づく投稿 {deleteTarget.count} 件は未分類になります。
            </p>
            <div className={styles.modalActions}>
              <button type="button" className={styles.modalCancelBtn} onClick={() => setDeleteTarget(null)}>
                キャンセル
              </button>
              <button type="button" className={styles.modalConfirmDanger} onClick={handleDelete}>
                削除する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategoriesScreen;
