import { z } from 'zod';

/** ログインリクエスト */
export const loginRequestSchema = z.object({
  realm: z.string().min(1),
  username: z.string().min(1),
  password: z.string().min(1),
});

/** ログインレスポンス */
export const loginResponseSchema = z.object({
  access_token: z.string(),
  expires_in: z.number(),
  refresh_expires_in: z.number(),
  refresh_token: z.string(),
  token_type: z.string(),
  session_state: z.string(),
  scope: z.string(),
});

/** 認証ユーザー */
export const authUserSchema = z.object({
  id: z.string(),
  username: z.string(),
  realm: z.string(),
  displayName: z.string().optional(),
});
