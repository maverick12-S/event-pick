/**
 * AdminSettingsScreen
 * ─────────────────────────────────────────────
 * システム設定画面。運営アカウント・サイト基本情報・通知・セキュリティを管理する。
 * モダンで洗練されたデザインを適用。
 */

import React, { useState } from 'react';
import {
  FiGlobe,
  FiBell,
  FiShield,
  FiUser,
  FiKey,
  FiSave,
  FiRotateCcw,
  FiMail,
  FiLock,
  FiClock,
  FiHash,
} from 'react-icons/fi';
import styles from './AdminSettingsScreen.module.css';

interface OperatorAccountSettings {
  displayName: string;
  username: string;
  email: string;
  phone: string;
  role: string;
}

interface PasswordSettings {
  currentPassword: string;
  nextPassword: string;
  confirmPassword: string;
}

interface SiteSettings {
  siteName: string;
  siteUrl: string;
  adminEmail: string;
  supportEmail: string;
  timezone: string;
  language: string;
  description: string;
}

interface NotifSettings {
  emailNewReview: boolean;
  emailNewInquiry: boolean;
  emailDailyReport: boolean;
  emailWeeklyReport: boolean;
}

interface SecuritySettings {
  twoFactorRequired: boolean;
  sessionTimeoutMin: number;
  maxLoginAttempts: number;
  ipWhitelist: string;
  passwordMinLength: number;
}

// ──────── デフォルト値 ────────
const DEFAULT_SITE: SiteSettings = {
  siteName: 'EventPick',
  siteUrl: 'https://eventpick.jp',
  adminEmail: 'admin@eventpick.jp',
  supportEmail: 'support@eventpick.jp',
  timezone: 'Asia/Tokyo',
  language: 'ja',
  description: 'イベント発見・管理プラットフォーム',
};

const DEFAULT_NOTIF: NotifSettings = {
  emailNewReview: true,
  emailNewInquiry: true,
  emailDailyReport: false,
  emailWeeklyReport: true,
};

const DEFAULT_SECURITY: SecuritySettings = {
  twoFactorRequired: false,
  sessionTimeoutMin: 60,
  maxLoginAttempts: 5,
  ipWhitelist: '',
  passwordMinLength: 8,
};

const DEFAULT_ACCOUNT: OperatorAccountSettings = {
  displayName: '田中 太郎',
  username: 'admin_tanaka',
  email: 'admin@eventpick.jp',
  phone: '03-1234-5678',
  role: '運営管理者',
};

const DEFAULT_PASSWORD: PasswordSettings = {
  currentPassword: '',
  nextPassword: '',
  confirmPassword: '',
};

// ──────── トグルコンポーネント ────────
const Toggle: React.FC<{ on: boolean; onChange: () => void }> = ({ on, onChange }) => (
  <button
    type="button"
    className={`${styles.toggle} ${on ? styles.toggleOn : ''}`}
    onClick={onChange}
    aria-pressed={on}
  />
);

const AdminSettingsScreen: React.FC = () => {
  const [account, setAccount] = useState<OperatorAccountSettings>(DEFAULT_ACCOUNT);
  const [password, setPassword] = useState<PasswordSettings>(DEFAULT_PASSWORD);
  const [site, setSite] = useState<SiteSettings>(DEFAULT_SITE);
  const [notif, setNotif] = useState<NotifSettings>(DEFAULT_NOTIF);
  const [security, setSecurity] = useState<SecuritySettings>(DEFAULT_SECURITY);

  const handleSave = () => {
    const passwordChanging = password.currentPassword || password.nextPassword || password.confirmPassword;
    if (passwordChanging) {
      if (!password.currentPassword || !password.nextPassword || !password.confirmPassword) {
        alert('パスワード変更には現在のパスワードと新しいパスワードをすべて入力してください');
        return;
      }
      if (password.nextPassword.length < security.passwordMinLength) {
        alert(`新しいパスワードは ${security.passwordMinLength} 文字以上で入力してください`);
        return;
      }
      if (password.nextPassword !== password.confirmPassword) {
        alert('新しいパスワードと確認用パスワードが一致していません');
        return;
      }
    }

    setPassword(DEFAULT_PASSWORD);
    alert(passwordChanging ? 'アカウント情報とパスワードを保存しました（モック）' : '設定を保存しました（モック）');
  };

  const handleReset = () => {
    setAccount(DEFAULT_ACCOUNT);
    setPassword(DEFAULT_PASSWORD);
    setSite(DEFAULT_SITE);
    setNotif(DEFAULT_NOTIF);
    setSecurity(DEFAULT_SECURITY);
  };

  return (
    <div className={styles.page}>
      {/* ■ 運営アカウント設定 */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={`${styles.sectionIcon} ${styles.iconAccount}`}><FiUser /></div>
          <div>
            <h3 className={styles.sectionTitle}>運営アカウント設定</h3>
            <p className={styles.sectionDesc}>ログイン中の運営アカウント情報とパスワードを管理します</p>
          </div>
        </div>
        <div className={styles.fieldGrid}>
          <div className={styles.field}>
            <label className={styles.fieldLabel}><FiUser className={styles.fieldIcon} />表示名</label>
            <input className={styles.input} value={account.displayName} onChange={(e) => setAccount((prev) => ({ ...prev, displayName: e.target.value }))} />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}><FiHash className={styles.fieldIcon} />ユーザー名</label>
            <input className={styles.input} value={account.username} onChange={(e) => setAccount((prev) => ({ ...prev, username: e.target.value }))} />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}><FiMail className={styles.fieldIcon} />メールアドレス</label>
            <input className={styles.input} type="email" value={account.email} onChange={(e) => setAccount((prev) => ({ ...prev, email: e.target.value }))} />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>電話番号</label>
            <input className={styles.input} value={account.phone} onChange={(e) => setAccount((prev) => ({ ...prev, phone: e.target.value }))} />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}><FiShield className={styles.fieldIcon} />権限</label>
            <input className={`${styles.input} ${styles.inputReadonly}`} value={account.role} readOnly />
            <span className={styles.fieldHint}>権限変更は上位管理者のみ実施できます</span>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.subHeader}>
          <FiKey className={styles.subHeaderIcon} />
          <span>パスワード変更</span>
          <span className={styles.subHeaderHint}>変更する場合のみ入力してください</span>
        </div>

        <div className={styles.fieldGrid}>
          <div className={styles.field}>
            <label className={styles.fieldLabel}><FiLock className={styles.fieldIcon} />現在のパスワード</label>
            <input className={styles.input} type="password" value={password.currentPassword} onChange={(e) => setPassword((prev) => ({ ...prev, currentPassword: e.target.value }))} />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}><FiLock className={styles.fieldIcon} />新しいパスワード</label>
            <input className={styles.input} type="password" value={password.nextPassword} onChange={(e) => setPassword((prev) => ({ ...prev, nextPassword: e.target.value }))} />
            <span className={styles.fieldHint}>{security.passwordMinLength} 文字以上で設定してください</span>
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}><FiLock className={styles.fieldIcon} />新しいパスワード（確認）</label>
            <input className={styles.input} type="password" value={password.confirmPassword} onChange={(e) => setPassword((prev) => ({ ...prev, confirmPassword: e.target.value }))} />
          </div>
        </div>
      </section>

      {/* ■ サイト基本設定 */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={`${styles.sectionIcon} ${styles.iconGeneral}`}><FiGlobe /></div>
          <div>
            <h3 className={styles.sectionTitle}>サイト基本設定</h3>
            <p className={styles.sectionDesc}>プラットフォームの基本情報を設定します</p>
          </div>
        </div>
        <div className={styles.fieldGrid}>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>サイト名</label>
            <input className={styles.input} value={site.siteName} onChange={(e) => setSite((s) => ({ ...s, siteName: e.target.value }))} />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>サイトURL</label>
            <input className={styles.input} value={site.siteUrl} onChange={(e) => setSite((s) => ({ ...s, siteUrl: e.target.value }))} />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>管理者メール</label>
            <input className={styles.input} type="email" value={site.adminEmail} onChange={(e) => setSite((s) => ({ ...s, adminEmail: e.target.value }))} />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>サポートメール</label>
            <input className={styles.input} type="email" value={site.supportEmail} onChange={(e) => setSite((s) => ({ ...s, supportEmail: e.target.value }))} />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>タイムゾーン</label>
            <select className={styles.select} value={site.timezone} onChange={(e) => setSite((s) => ({ ...s, timezone: e.target.value }))}>
              <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
              <option value="UTC">UTC</option>
              <option value="America/New_York">America/New_York (EST)</option>
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>言語</label>
            <select className={styles.select} value={site.language} onChange={(e) => setSite((s) => ({ ...s, language: e.target.value }))}>
              <option value="ja">日本語</option>
              <option value="en">English</option>
            </select>
          </div>
          <div className={`${styles.field} ${styles.fieldFull}`}>
            <label className={styles.fieldLabel}>サイト説明</label>
            <textarea className={styles.textarea} value={site.description} onChange={(e) => setSite((s) => ({ ...s, description: e.target.value }))} />
          </div>
        </div>
      </section>

      {/* ■ メール通知設定 */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={`${styles.sectionIcon} ${styles.iconNotify}`}><FiBell /></div>
          <div>
            <h3 className={styles.sectionTitle}>メール通知設定</h3>
            <p className={styles.sectionDesc}>メール通知の配信設定を管理します</p>
          </div>
        </div>
        <div className={styles.toggleList}>
          <div className={styles.toggleRow}>
            <div className={styles.toggleInfo}>
              <span className={styles.toggleLabel}>新規審査申請</span>
              <span className={styles.toggleDesc}>法人の審査申請があった場合にメール通知を送信</span>
            </div>
            <Toggle on={notif.emailNewReview} onChange={() => setNotif((n) => ({ ...n, emailNewReview: !n.emailNewReview }))} />
          </div>
          <div className={styles.toggleRow}>
            <div className={styles.toggleInfo}>
              <span className={styles.toggleLabel}>新規お問い合わせ</span>
              <span className={styles.toggleDesc}>お問い合わせを受信した際にメール通知を送信</span>
            </div>
            <Toggle on={notif.emailNewInquiry} onChange={() => setNotif((n) => ({ ...n, emailNewInquiry: !n.emailNewInquiry }))} />
          </div>
          <div className={styles.toggleRow}>
            <div className={styles.toggleInfo}>
              <span className={styles.toggleLabel}>デイリーレポート</span>
              <span className={styles.toggleDesc}>毎日 09:00 にサマリーレポートをメール送信</span>
            </div>
            <Toggle on={notif.emailDailyReport} onChange={() => setNotif((n) => ({ ...n, emailDailyReport: !n.emailDailyReport }))} />
          </div>
          <div className={styles.toggleRow}>
            <div className={styles.toggleInfo}>
              <span className={styles.toggleLabel}>ウィークリーレポート</span>
              <span className={styles.toggleDesc}>毎週月曜 09:00 に週次レポートをメール送信</span>
            </div>
            <Toggle on={notif.emailWeeklyReport} onChange={() => setNotif((n) => ({ ...n, emailWeeklyReport: !n.emailWeeklyReport }))} />
          </div>
        </div>
      </section>

      {/* ■ セキュリティ */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={`${styles.sectionIcon} ${styles.iconSecurity}`}><FiShield /></div>
          <div>
            <h3 className={styles.sectionTitle}>セキュリティ</h3>
            <p className={styles.sectionDesc}>認証・アクセス制御の設定を管理します</p>
          </div>
        </div>
        <div className={styles.toggleList}>
          <div className={styles.toggleRow}>
            <div className={styles.toggleInfo}>
              <span className={styles.toggleLabel}>二要素認証の必須化</span>
              <span className={styles.toggleDesc}>すべての運営アカウントに対して 2FA を必須にします</span>
            </div>
            <Toggle on={security.twoFactorRequired} onChange={() => setSecurity((s) => ({ ...s, twoFactorRequired: !s.twoFactorRequired }))} />
          </div>
        </div>
        <div className={styles.fieldGrid} style={{ marginTop: 20 }}>
          <div className={styles.field}>
            <label className={styles.fieldLabel}><FiClock className={styles.fieldIcon} />セッションタイムアウト（分）</label>
            <input className={styles.input} type="number" min={5} value={security.sessionTimeoutMin} onChange={(e) => setSecurity((s) => ({ ...s, sessionTimeoutMin: Number(e.target.value) }))} />
            <span className={styles.fieldHint}>無操作時の自動ログアウトまでの時間</span>
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>最大ログイン試行回数</label>
            <input className={styles.input} type="number" min={1} value={security.maxLoginAttempts} onChange={(e) => setSecurity((s) => ({ ...s, maxLoginAttempts: Number(e.target.value) }))} />
            <span className={styles.fieldHint}>超過するとアカウントを一時ロック</span>
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>パスワード最小文字数</label>
            <input className={styles.input} type="number" min={6} value={security.passwordMinLength} onChange={(e) => setSecurity((s) => ({ ...s, passwordMinLength: Number(e.target.value) }))} />
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>IP ホワイトリスト</label>
            <input className={styles.input} placeholder="例: 203.0.113.0/24, 198.51.100.1" value={security.ipWhitelist} onChange={(e) => setSecurity((s) => ({ ...s, ipWhitelist: e.target.value }))} />
            <span className={styles.fieldHint}>空欄の場合はすべての IP を許可</span>
          </div>
        </div>
      </section>

      {/* 保存バー */}
      <div className={styles.saveBar}>
        <button type="button" className={styles.resetBtn} onClick={handleReset}>
          <FiRotateCcw size={14} />
          リセット
        </button>
        <button type="button" className={styles.saveBtn} onClick={handleSave}>
          <FiSave size={14} />
          変更を保存
        </button>
      </div>
    </div>
  );
};

export default AdminSettingsScreen;
