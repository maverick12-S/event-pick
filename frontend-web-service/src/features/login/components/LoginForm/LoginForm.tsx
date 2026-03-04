// =============================================
// 原則：コンポーネントは「見た目の定義」のみ
// ロジック（validation, API call）はhookに任せる
// propsで動作を注入 → テストしやすい
// =============================================

import React, { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
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
    const [showPassword, setShowPassword] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<{[k:string]: string | null}>({});
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // client-side validation: mark empty fields
        const errs: {[k:string]: string|null} = {};
        if (!realm) errs.realm = '入力してください';
        if (!username) errs.username = '入力してください';
        if (!password) errs.password = '入力してください';
        setFieldErrors(errs);
        const hasErr = Object.keys(errs).length > 0;
        if (hasErr) return;
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
                    className={`${styles.input} ${fieldErrors.realm ? styles.inputInvalid : ''}`}
                    placeholder="拠点レルム"
                    value={realm}
                    onChange={(e) => { setRealm(e.target.value); if (fieldErrors.realm) setFieldErrors({...fieldErrors, realm: null}); }}
                    autoComplete="realm"
                    required
                />
            </div>

            {/* ユーザー名 */}
            <div className={styles.fieldGroup}>
                <input
                    id="username"
                    type="text"
                    className={`${styles.input} ${fieldErrors.username ? styles.inputInvalid : ''}`}
                    placeholder="拠点アカウントID"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); if (fieldErrors.username) setFieldErrors({...fieldErrors, username: null}); }}
                    autoComplete="username"
                    required
                />
            </div>

            {/* パスワード */}
                <div className={styles.fieldGroup}>
                    <div className={styles.fieldWithToggle}>
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            className={`${styles.input} ${fieldErrors.password ? styles.inputInvalid : ''}`}
                            placeholder="パスワード"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); if (fieldErrors.password) setFieldErrors({...fieldErrors, password: null}); }}
                            autoComplete="current-password"
                            required
                        />
                        <button
                            type="button"
                            aria-label={showPassword ? 'パスワードを非表示' : 'パスワードを表示'}
                            className={styles.toggleButton}
                            onClick={() => setShowPassword((s) => !s)}
                        >
                            {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                        </button>
                    </div>
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