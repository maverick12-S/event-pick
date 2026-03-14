import { describe, it, expect } from 'vitest';
import { isOperatorCredential, OPERATOR_LOGIN } from '../operatorCredentials';

describe('operatorCredentials', () => {
  describe('OPERATOR_LOGIN', () => {
    it('has expected realm/username/password', () => {
      expect(OPERATOR_LOGIN.realm).toBe('08001234');
      expect(OPERATOR_LOGIN.username).toBe('test');
      expect(OPERATOR_LOGIN.password).toBe('12345678');
    });
  });

  describe('isOperatorCredential', () => {
    it('returns true for exact match', () => {
      expect(isOperatorCredential({ realm: '08001234', username: 'test', password: '12345678' })).toBe(true);
    });

    it('returns true with trimmed whitespace', () => {
      expect(isOperatorCredential({ realm: ' 08001234 ', username: ' test ', password: '12345678' })).toBe(true);
    });

    it('returns false for wrong realm', () => {
      expect(isOperatorCredential({ realm: '99999999', username: 'test', password: '12345678' })).toBe(false);
    });

    it('returns false for wrong username', () => {
      expect(isOperatorCredential({ realm: '08001234', username: 'admin', password: '12345678' })).toBe(false);
    });

    it('returns false for wrong password', () => {
      expect(isOperatorCredential({ realm: '08001234', username: 'test', password: 'wrongpass' })).toBe(false);
    });
  });
});
