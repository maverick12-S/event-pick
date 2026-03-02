import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '../../features/login/api/authApi';
import type { LoginRequest, AuthUser } from '../../types/auth';

interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  accessToken: string | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean; // 起動時のトークンチェック完了フラグ
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  accessToken: null,
  isLoading: false,
  error: null,
  isInitialized: false,
};

// ── ログイン（非同期）──────────────────────────────
export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const res = await authApi.login(credentials);
      localStorage.setItem('accessToken', res.accessToken);
      localStorage.setItem('refreshToken', res.refreshToken);
      return res;
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } }).response?.status;
      if (status === 401) return rejectWithValue('ユーザー名またはパスワードが正しくありません。');
      return rejectWithValue('ログインに失敗しました。時間をおいて再度お試しください。');
    }
  }
);

// ── 起動時トークン復元（非同期）────────────────────
export const initializeAuthThunk = createAsyncThunk(
  'auth/initialize',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return rejectWithValue('no_token');
    // TODO: バックエンドでトークン検証 → return { accessToken: token, user }
    return { accessToken: token, user: null as AuthUser | null };
  }
);

// ── Slice ──────────────────────────────────────────
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      Object.assign(state, initialState, { isInitialized: true });
    },
    clearError(state) {
      state.error = null;
    },
    setUser(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    // loginThunk
    builder
      .addCase(loginThunk.pending,    (state) => { state.isLoading = true; state.error = null; })
      .addCase(loginThunk.fulfilled,  (state, { payload }) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = payload.user;
        state.accessToken = payload.accessToken;
      })
      .addCase(loginThunk.rejected,   (state, { payload }) => {
        state.isLoading = false;
        state.error = payload as string;
      });

    // initializeAuthThunk
    builder
      .addCase(initializeAuthThunk.fulfilled, (state, { payload }) => {
        state.isAuthenticated = true;
        state.accessToken = payload.accessToken;
        state.user = payload.user;
        state.isInitialized = true;
      })
      .addCase(initializeAuthThunk.rejected, (state) => {
        state.isAuthenticated = false;
        state.isInitialized = true; // 失敗でも「チェック完了」
      });
  },
});

export const { logout, clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
