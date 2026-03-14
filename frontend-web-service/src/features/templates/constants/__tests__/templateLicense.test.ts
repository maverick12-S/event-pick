import { describe, it, expect } from 'vitest';
import {
  AGREEMENT_VERSION, AGREEMENT_CHECKBOXES, TEMPLATE_LICENSE_TEXT,
} from '../templateLicense';

describe('templateLicense constants', () => {
  it('AGREEMENT_VERSION is a semver string', () => {
    expect(AGREEMENT_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it('AGREEMENT_CHECKBOXES has 3 items', () => {
    expect(AGREEMENT_CHECKBOXES).toHaveLength(3);
  });

  it('each checkbox has key and label', () => {
    for (const cb of AGREEMENT_CHECKBOXES) {
      expect(cb.key).toBeTruthy();
      expect(cb.label).toBeTruthy();
    }
  });

  it('AGREEMENT_CHECKBOXES keys are unique', () => {
    const keys = AGREEMENT_CHECKBOXES.map(c => c.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('TEMPLATE_LICENSE_TEXT is a non-empty string', () => {
    expect(typeof TEMPLATE_LICENSE_TEXT).toBe('string');
    expect(TEMPLATE_LICENSE_TEXT.length).toBeGreaterThan(100);
  });

  it('TEMPLATE_LICENSE_TEXT contains key sections', () => {
    expect(TEMPLATE_LICENSE_TEXT).toContain('利用ライセンス承諾書');
    expect(TEMPLATE_LICENSE_TEXT).toContain('以上');
  });
});
