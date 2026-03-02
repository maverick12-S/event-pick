// =============================================
// 原則：コンポーネントは「見た目の定義」のみ
// ロジック（validation, API call）はhookに任せる
// propsで動作を注入 → テストしやすい
// =============================================

import React, { useState } from 'react';
import type { LoginRequest } from '../../../../types/auth';
import styles from './LoginForm.module.css';

interface LoginFormProps {
    isLoading: boolean;
    error: string | null;
    onSubmit: (data: LoginRequest) => void;
    onPasswordReset: () => void;
    onNewAccount: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
    isLoading,
    error,
    onSubmit,
    onPasswordReset,
    onNewAccount
}) => {
     // フォームのローカル状態（UIの一時的な値）
    const [realm, setRealm] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ realm, username, password });
    };
    return (
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
            {/* タイトルは Screen 側で出すためここでは表示しない */}
            {/* エラーメッセージ表示 */}
            {error && (
                <div className={styles.errorBanner} role="alert">
                    {error}
                </div>
            )}

            {/*  拠点レルム  */}
            <div className={styles.fieldGroup}>
                <input
                    id="realm"
                    type="text"
                    className={styles.input}
                    placeholder="拠点レルム"
                    value={realm}
                    onChange={(e) => setRealm(e.target.value)}
                    autoComplete="realm"
                    required
                />
            </div>

            {/* ユーザー名 */}
            <div className={styles.fieldGroup}>
                <input
                    id="username"
                    type="text"
                    className={styles.input}
                    placeholder="拠点アカウントID"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    required
                />
            </div>

            {/* パスワード */}
            <div className={styles.fieldGroup}>
                <input
                    id="password"
                    type="password"
                    className={styles.input}
                    placeholder="パスワード"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                />
            </div>

            {/* ログインボタン */}
            <button
                type="submit"
                className={styles.submitButton}
                disabled={isLoading}
            >
                {isLoading ? 'ログイン中...' : 'ログイン'}
            </button>

            {/* リンク群 */}
            <div className={styles.links}>
                <button
                    type="button"
                    className={styles.linkButton}
                    onClick={onPasswordReset}
                >
                    パスワードを忘れた場合
                </button>
                <button
                    type="button"
                    className={styles.linkButton}
                    onClick={onNewAccount}
                >
                    新規アカウント作成
                </button>
            </div>
        </form>
    );
};

export default LoginForm;