import type { LoginRequest } from '../../../types/auth';

export const OPERATOR_LOGIN = {
  realm: '08001234',
  username: 'test',
  password: '12345678',
} as const;

export const isOperatorCredential = (credentials: LoginRequest): boolean => {
  return (
    credentials.realm.trim() === OPERATOR_LOGIN.realm
    && credentials.username.trim() === OPERATOR_LOGIN.username
    && credentials.password === OPERATOR_LOGIN.password
  );
};
