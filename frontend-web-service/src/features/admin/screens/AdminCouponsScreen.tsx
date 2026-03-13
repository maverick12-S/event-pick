/**
 * AdminCouponsScreen
 * ─────────────────────────────────────────────
 * クーポン管理画面。クーポンの生成・一覧管理を行う。
 */

import React, { useState } from 'react';
import { FiGift } from 'react-icons/fi';
import styles from './AdminCouponsScreen.module.css';

interface Coupon {
  id: string;
  code: string;
  type: 'percent' | 'fixed';
  discount: number;
  maxUses: number;
  usedCount: number;
  expiresAt: string;
  status: 'active' | 'expired' | 'used';
  createdAt: string;
}

const INITIAL_COUPONS: Coupon[] = [
  { id: 'cp01', code: 'WELCOME2026', type: 'percent', discount: 10, maxUses: 1000, usedCount: 342, expiresAt: '2026-06-30', status: 'active', createdAt: '2026-01-01' },
  { id: 'cp02', code: 'SPRING500', type: 'fixed', discount: 500, maxUses: 500, usedCount: 187, expiresAt: '2026-04-30', status: 'active', createdAt: '2026-03-01' },
  { id: 'cp03', code: 'SUMMER20', type: 'percent', discount: 20, maxUses: 300, usedCount: 300, expiresAt: '2026-08-31', status: 'used', createdAt: '2026-02-15' },
  { id: 'cp04', code: 'NEWYEAR1000', type: 'fixed', discount: 1000, maxUses: 200, usedCount: 156, expiresAt: '2026-01-31', status: 'expired', createdAt: '2025-12-25' },
  { id: 'cp05', code: 'EVENT15', type: 'percent', discount: 15, maxUses: 800, usedCount: 45, expiresAt: '2026-12-31', status: 'active', createdAt: '2026-03-10' },
];

const TYPE_LABELS: Record<string, string> = { percent: '割引率', fixed: '定額値引' };
const STATUS_LABELS: Record<string, string> = { active: '有効', expired: '期限切れ', used: '上限到達' };

const AdminCouponsScreen: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);

  // 生成フォーム
  const [code, setCode] = useState('');
  const [type, setType] = useState<'percent' | 'fixed'>('percent');
  const [discount, setDiscount] = useState('');
  const [maxUses, setMaxUses] = useState('');
  const [expiresAt, setExpiresAt] = useState('');

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedCode = code.trim().toUpperCase();
    if (!trimmedCode || !discount || !maxUses || !expiresAt) return;

    const newCoupon: Coupon = {
      id: `cp_${Date.now()}`,
      code: trimmedCode,
      type,
      discount: Number(discount),
      maxUses: Number(maxUses),
      usedCount: 0,
      expiresAt,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCoupons((prev) => [newCoupon, ...prev]);
    setCode('');
    setDiscount('');
    setMaxUses('');
    setExpiresAt('');
  };

  const formatDiscount = (coupon: Coupon) =>
    coupon.type === 'percent' ? `${coupon.discount}%` : `¥${coupon.discount.toLocaleString()}`;

  return (
    <div className={styles.page}>
      {/* ── 生成フォーム ── */}
      <div className={styles.generateCard}>
        <h2 className={styles.generateTitle}>クーポン生成</h2>
        <form className={styles.generateForm} onSubmit={handleGenerate}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>クーポンコード</label>
              <input
                type="text"
                className={styles.formInput}
                placeholder="例: SUMMER2026"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={20}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>割引タイプ</label>
              <select className={styles.formSelect} value={type} onChange={(e) => setType(e.target.value as 'percent' | 'fixed')}>
                <option value="percent">割引率（%）</option>
                <option value="fixed">定額値引（¥）</option>
              </select>
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                割引値 {type === 'percent' ? '(%)' : '(¥)'}
              </label>
              <input
                type="number"
                className={styles.formInput}
                placeholder={type === 'percent' ? '10' : '500'}
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                min="1"
                max={type === 'percent' ? '100' : '100000'}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>利用上限数</label>
              <input
                type="number"
                className={styles.formInput}
                placeholder="500"
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value)}
                min="1"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>有効期限</label>
              <input
                type="date"
                className={styles.formInput}
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
          <button type="submit" className={styles.generateBtn}>
            <FiGift /> クーポンを生成
          </button>
        </form>
      </div>

      {/* ── クーポン一覧 ── */}
      <div className={styles.listCard}>
        <div className={styles.listHeader}>
          <h2 className={styles.listTitle}>クーポン一覧</h2>
          <span className={styles.countBadge}>{coupons.length} 件</span>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>コード</th>
                <th>タイプ</th>
                <th>割引</th>
                <th>利用数 / 上限</th>
                <th>有効期限</th>
                <th>ステータス</th>
                <th>作成日</th>
              </tr>
            </thead>
            <tbody>
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className={styles.emptyRow}>クーポンがありません</td>
                </tr>
              ) : (
                coupons.map((cp) => (
                  <tr key={cp.id}>
                    <td><span className={styles.codeBadge}>{cp.code}</span></td>
                    <td><span className={styles.typeBadge}>{TYPE_LABELS[cp.type]}</span></td>
                    <td>{formatDiscount(cp)}</td>
                    <td>{cp.usedCount.toLocaleString()} / {cp.maxUses.toLocaleString()}</td>
                    <td className={styles.mono}>{cp.expiresAt}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${styles[`status_${cp.status}`]}`}>
                        {STATUS_LABELS[cp.status]}
                      </span>
                    </td>
                    <td className={styles.mono}>{cp.createdAt}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCouponsScreen;
