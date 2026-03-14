import { describe, it, expect } from 'vitest';
import {
  loginRequestSchema, loginResponseSchema, authUserSchema,
  signupRequestSchema, signupResponseSchema,
  passwordResetRequestSchema, passwordResetResponseSchema,
  passwordChangeRequestSchema, passwordChangeResponseSchema,
  mfaVerifyRequestSchema, mfaVerifyResponseSchema,
} from '../auth.schema';

describe('auth.schema', () => {
  describe('loginRequestSchema', () => {
    it('accepts valid', () => {
      expect(loginRequestSchema.parse({ realm: 'co1', username: 'user', password: 'pass' })).toBeTruthy();
    });
    it('rejects empty realm', () => {
      expect(() => loginRequestSchema.parse({ realm: '', username: 'u', password: 'p' })).toThrow();
    });
  });

  describe('loginResponseSchema', () => {
    it('accepts valid', () => {
      const v = {
        access_token: 'at', expires_in: 3600, refresh_expires_in: 86400,
        refresh_token: 'rt', token_type: 'Bearer', session_state: 'ss', scope: 'openid',
      };
      expect(loginResponseSchema.parse(v)).toEqual(v);
    });
  });

  describe('authUserSchema', () => {
    it('accepts valid with optional displayName', () => {
      expect(authUserSchema.parse({ id: '1', username: 'u', realm: 'r', displayName: 'D' })).toBeTruthy();
    });
    it('accepts without displayName', () => {
      expect(authUserSchema.parse({ id: '1', username: 'u', realm: 'r' })).toBeTruthy();
    });
  });

  describe('signupRequestSchema', () => {
    const valid = {
      company_code: 'C001', company_name: '株式会社テスト',
      representative_name: '田中太郎', company_type: '1' as const,
      admin_email: 'admin@test.com', login_type: '1' as const,
    };
    it('accepts valid', () => {
      expect(signupRequestSchema.parse(valid)).toMatchObject(valid);
    });
    it('rejects invalid company_type', () => {
      expect(() => signupRequestSchema.parse({ ...valid, company_type: '9' })).toThrow();
    });
    it('rejects invalid email', () => {
      expect(() => signupRequestSchema.parse({ ...valid, admin_email: 'bad' })).toThrow();
    });
  });

  describe('signupResponseSchema', () => {
    it('accepts valid', () => {
      expect(signupResponseSchema.parse({
        review_id: 'a'.repeat(26), mfa_destination: '+81901234567',
      })).toBeTruthy();
    });
    it('rejects review_id wrong length', () => {
      expect(() => signupResponseSchema.parse({ review_id: 'short', mfa_destination: 'x' })).toThrow();
    });
  });

  describe('passwordResetRequestSchema', () => {
    it('accepts valid email', () => {
      expect(passwordResetRequestSchema.parse({ email: 'a@b.com' })).toBeTruthy();
    });
    it('rejects invalid email', () => {
      expect(() => passwordResetRequestSchema.parse({ email: 'nope' })).toThrow();
    });
  });

  describe('passwordResetResponseSchema', () => {
    it('accepts { sent: true }', () => {
      expect(passwordResetResponseSchema.parse({ sent: true })).toEqual({ sent: true });
    });
  });

  describe('passwordChangeRequestSchema', () => {
    it('accepts strong password', () => {
      expect(passwordChangeRequestSchema.parse({ token: 't', new_password: 'Abcdef1!' })).toBeTruthy();
    });
    it('rejects missing uppercase', () => {
      expect(() => passwordChangeRequestSchema.parse({ token: 't', new_password: 'abcdef1!' })).toThrow();
    });
    it('rejects missing lowercase', () => {
      expect(() => passwordChangeRequestSchema.parse({ token: 't', new_password: 'ABCDEF1!' })).toThrow();
    });
    it('rejects missing digit', () => {
      expect(() => passwordChangeRequestSchema.parse({ token: 't', new_password: 'Abcdefg!' })).toThrow();
    });
    it('rejects missing symbol', () => {
      expect(() => passwordChangeRequestSchema.parse({ token: 't', new_password: 'Abcdefg1' })).toThrow();
    });
    it('rejects too short', () => {
      expect(() => passwordChangeRequestSchema.parse({ token: 't', new_password: 'Ab1!' })).toThrow();
    });
  });

  describe('passwordChangeResponseSchema', () => {
    it('accepts { changed: true }', () => {
      expect(passwordChangeResponseSchema.parse({ changed: true })).toEqual({ changed: true });
    });
  });

  describe('mfaVerifyRequestSchema', () => {
    it('accepts valid', () => {
      expect(mfaVerifyRequestSchema.parse({ code: '123456', purpose: 'login', session_token: 'st' })).toBeTruthy();
    });
    it('rejects code not 6 digits', () => {
      expect(() => mfaVerifyRequestSchema.parse({ code: '12345', purpose: 'login', session_token: 'st' })).toThrow();
    });
    it('rejects invalid purpose', () => {
      expect(() => mfaVerifyRequestSchema.parse({ code: '123456', purpose: 'invalid', session_token: 'st' })).toThrow();
    });
  });

  describe('mfaVerifyResponseSchema', () => {
    it('accepts with token', () => {
      expect(mfaVerifyResponseSchema.parse({ verified: true, token: 'abc' })).toBeTruthy();
    });
    it('accepts without token', () => {
      expect(mfaVerifyResponseSchema.parse({ verified: false })).toBeTruthy();
    });
  });
});
