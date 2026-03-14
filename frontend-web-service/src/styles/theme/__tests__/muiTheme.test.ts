import { describe, it, expect } from 'vitest';
import { authTheme, appTheme } from '../muiTheme';

describe('muiTheme', () => {
  describe('authTheme', () => {
    it('is dark mode', () => {
      expect(authTheme.palette.mode).toBe('dark');
    });

    it('has primary color', () => {
      expect(authTheme.palette.primary.main).toBe('#0a66ff');
    });

    it('has secondary color', () => {
      expect(authTheme.palette.secondary.main).toBe('#00d2e6');
    });

    it('has dark background', () => {
      expect(authTheme.palette.background.default).toBe('#071020');
    });

    it('has border radius 12', () => {
      expect(authTheme.shape.borderRadius).toBe(12);
    });

    it('has typography with Noto Sans JP', () => {
      expect(authTheme.typography.fontFamily).toContain('Noto Sans JP');
    });
  });

  describe('appTheme', () => {
    it('is light mode', () => {
      expect(appTheme.palette.mode).toBe('light');
    });

    it('has orange primary', () => {
      expect(appTheme.palette.primary.main).toBe('#FF6B3D');
    });

    it('has white paper background', () => {
      expect(appTheme.palette.background.paper).toBe('#ffffff');
    });

    it('has border radius 16', () => {
      expect(appTheme.shape.borderRadius).toBe(16);
    });
  });
});
