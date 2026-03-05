// 型定義: ログイン用のリクエスト/レスポンスと認証状態
export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
    refresh_token: string;
}

export interface User {
    id: string;
    username: string;
    email?: string;
}

export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
}
