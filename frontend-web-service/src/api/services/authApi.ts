/**
 * 認証 API サービス
 * ─────────────────────────────────────────────
 * 画面: LoginScreen, SignupScreen, PasswordResetScreen, PasswordChangeScreen, MfaScreen
 * DTO: auth.dto.ts — Zod: auth.schema.ts
 */
import { apiClient } from '../http';
import endpoints from '../endpoints';
import {
  signupRequestSchema,
  signupResponseSchema,
  passwordResetRequestSchema,
  passwordResetResponseSchema,
  passwordChangeRequestSchema,
  passwordChangeResponseSchema,
  mfaVerifyRequestSchema,
  mfaVerifyResponseSchema,
  loginRequestSchema,
  loginResponseSchema,
} from '../../types/schemas';
import type {
  SignupRequest, SignupResponse,
  PasswordResetRequest, PasswordResetResponse,
  PasswordChangeRequest, PasswordChangeResponse,
  MfaVerifyRequest, MfaVerifyResponse,
  ApiResponse,
} from '../../types/dto';
import type { LoginRequest, LoginResponse } from '../../types/auth';

const unwrap = <T>(res: { data: ApiResponse<T> }): T => {
  const body = res.data;
  if (!body.success || !body.data) {
    throw new Error(body.error?.message || 'API error');
  }
  return body.data;
};

export const authApi = {
  /** ログイン POST /auth/login */
  login: async (req: LoginRequest): Promise<LoginResponse> => {
    const validated = loginRequestSchema.parse(req);
    const res = await apiClient.post<ApiResponse<LoginResponse>>(endpoints.authLogin, validated);
    return loginResponseSchema.parse(unwrap(res));
  },

  /** 企業サインアップ POST /auth/signup */
  signup: async (req: SignupRequest): Promise<SignupResponse> => {
    const validated = signupRequestSchema.parse(req);
    const res = await apiClient.post<ApiResponse<SignupResponse>>(endpoints.authSignup, validated);
    return signupResponseSchema.parse(unwrap(res));
  },

  /** パスワードリセット要求 POST /auth/password-reset */
  passwordReset: async (req: PasswordResetRequest): Promise<PasswordResetResponse> => {
    const validated = passwordResetRequestSchema.parse(req);
    const res = await apiClient.post<ApiResponse<PasswordResetResponse>>(endpoints.authPasswordReset, validated);
    return passwordResetResponseSchema.parse(unwrap(res));
  },

  /** パスワード変更 POST /auth/password-change */
  passwordChange: async (req: PasswordChangeRequest): Promise<PasswordChangeResponse> => {
    const validated = passwordChangeRequestSchema.parse(req);
    const res = await apiClient.post<ApiResponse<PasswordChangeResponse>>(endpoints.authPasswordChange, validated);
    return passwordChangeResponseSchema.parse(unwrap(res));
  },

  /** MFA検証 POST /auth/mfa/verify */
  mfaVerify: async (req: MfaVerifyRequest): Promise<MfaVerifyResponse> => {
    const validated = mfaVerifyRequestSchema.parse(req);
    const res = await apiClient.post<ApiResponse<MfaVerifyResponse>>(endpoints.authMfaVerify, validated);
    return mfaVerifyResponseSchema.parse(unwrap(res));
  },

  /** ログアウト POST /auth/logout */
  logout: async (): Promise<void> => {
    await apiClient.post(endpoints.authLogout);
  },

  /** トークンリフレッシュ POST /auth/refresh */
  refresh: async (): Promise<LoginResponse> => {
    const res = await apiClient.post<ApiResponse<LoginResponse>>(endpoints.authRefresh);
    return unwrap(res);
  },
};
