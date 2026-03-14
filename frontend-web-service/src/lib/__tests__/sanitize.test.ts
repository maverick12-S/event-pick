/**
 * sanitize.ts — 禁止文字チェック・サニタイズ関数のテスト
 * ───────────────────────────────────────────────
 * 商用リリースまで一貫した振る舞いを保証する。
 * CIで安定的に動作する純粋関数のテスト。
 */

import {
  containsForbidden,
  containsForbiddenUrl,
  trimValue,
  escapeHtml,
  stripControlChars,
  sanitize,
  sanitizeFields,
  FORBIDDEN_CHARS_MSG,
  safeString,
  safeEmail,
  safeUrl,
} from '../sanitize';

// ═══════════════════════════════════════════════
// containsForbidden
// ═══════════════════════════════════════════════

describe('containsForbidden', () => {
  it.each([
    ['<script>', '<'],
    ['alert("xss")', '"'],
    ["O'Reilly", "'"],
    ['DROP TABLE;', ';'],
    ['$(cmd)', '$'],
    ['a|b', '|'],
    ['a\\b', '\\'],
    ['SELECT -- comment', '--'],
    ['abc\0def', '\\0 (NULL byte)'],
    ['/* comment */', '/*'],
    ['`backtick`', '`'],
  ])('禁止文字「%s」を検出する（含む: %s）', (input) => {
    expect(containsForbidden(input)).toBe(true);
  });

  it.each([
    ['東京都渋谷区1-2-3'],
    ['Hello World'],
    ['test@example.com'],
    ['日本語テスト文字列'],
    ['abcdefghijklmnopqrstuvwxyz'],
    ['ABCDEFGHIJKLMNOPQRSTUVWXYZ'],
    ['0123456789'],
    ['スペース 入り'],
    ['ハイフン-アンダースコア_'],
    ['括弧(丸)と[角]'],
    ['プラス+イコール='],
    ['https://example.com'],
  ])('安全な文字列「%s」を許可する', (input) => {
    expect(containsForbidden(input)).toBe(false);
  });

  it('空文字列は禁止文字なしと判定', () => {
    expect(containsForbidden('')).toBe(false);
  });
});

// ═══════════════════════════════════════════════
// containsForbiddenUrl
// ═══════════════════════════════════════════════

describe('containsForbiddenUrl', () => {
  it('URLクエリパラメータに使用される文字を許可する', () => {
    // URL用パターンでは ? & = は許可
    expect(containsForbiddenUrl('https://example.com/path?key=value&key2=value2')).toBe(false);
  });

  it.each([
    ['<script>alert(1)</script>'],
    ['https://evil.com/"onmouseover="alert(1)'],
    ["https://evil.com/'--"],
  ])('URL内の危険文字「%s」を検出する', (input) => {
    expect(containsForbiddenUrl(input)).toBe(true);
  });
});

// ═══════════════════════════════════════════════
// trimValue
// ═══════════════════════════════════════════════

describe('trimValue', () => {
  it('前後の空白をトリムする', () => {
    expect(trimValue('  hello world  ')).toBe('hello world');
  });

  it('前後のタブ・改行をトリムする', () => {
    expect(trimValue('\n\thello\t\n')).toBe('hello');
  });

  it('中間の空白は保持する', () => {
    expect(trimValue('hello  world')).toBe('hello  world');
  });

  it('空文字列はそのまま', () => {
    expect(trimValue('')).toBe('');
  });
});

// ═══════════════════════════════════════════════
// escapeHtml
// ═══════════════════════════════════════════════

describe('escapeHtml', () => {
  it('HTMLの特殊文字をエスケープする', () => {
    expect(escapeHtml('<div class="test">O\'Reilly & Sons</div>')).toBe(
      '&lt;div class=&quot;test&quot;&gt;O&#39;Reilly &amp; Sons&lt;/div&gt;',
    );
  });

  it('安全な文字はそのまま返す', () => {
    expect(escapeHtml('Hello World')).toBe('Hello World');
  });

  it('空文字列はそのまま', () => {
    expect(escapeHtml('')).toBe('');
  });
});

// ═══════════════════════════════════════════════
// stripControlChars
// ═══════════════════════════════════════════════

describe('stripControlChars', () => {
  it('制御文字を除去する', () => {
    expect(stripControlChars('abc\x00\x01\x02def')).toBe('abcdef');
  });

  it('改行・タブは保持する', () => {
    expect(stripControlChars('line1\nline2\ttab')).toBe('line1\nline2\ttab');
  });

  it('DEL文字（0x7F）を除去する', () => {
    expect(stripControlChars('abc\x7Fdef')).toBe('abcdef');
  });

  it('日本語文字は保持する', () => {
    expect(stripControlChars('東京\x00タワー')).toBe('東京タワー');
  });
});

// ═══════════════════════════════════════════════
// sanitize
// ═══════════════════════════════════════════════

describe('sanitize', () => {
  it('trim + 制御文字除去を行う', () => {
    expect(sanitize('  hello\x00world  ')).toBe('helloworld');
  });

  it('改行は保持する', () => {
    expect(sanitize('line1\nline2')).toBe('line1\nline2');
  });
});

// ═══════════════════════════════════════════════
// sanitizeFields
// ═══════════════════════════════════════════════

describe('sanitizeFields', () => {
  it('全stringフィールドをサニタイズする', () => {
    const input = {
      name: '  田中太郎\x00  ',
      age: 30,
      email: '  test@example.com  ',
      active: true,
    };
    const result = sanitizeFields(input);
    expect(result.name).toBe('田中太郎');
    expect(result.email).toBe('test@example.com');
    expect(result.age).toBe(30);
    expect(result.active).toBe(true);
  });

  it('元のオブジェクトを変更しない（イミュータブル）', () => {
    const input = { name: '  test  ' };
    const result = sanitizeFields(input);
    expect(result).not.toBe(input);
    expect(input.name).toBe('  test  ');
    expect(result.name).toBe('test');
  });
});

// ═══════════════════════════════════════════════
// FORBIDDEN_CHARS_MSG
// ═══════════════════════════════════════════════

describe('FORBIDDEN_CHARS_MSG', () => {
  it('エラーメッセージが定義されている', () => {
    expect(typeof FORBIDDEN_CHARS_MSG).toBe('string');
    expect(FORBIDDEN_CHARS_MSG.length).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════
// Zod カスタムバリデータ (safeString / safeEmail / safeUrl)
// ═══════════════════════════════════════════════

describe('safeString', () => {
  it('通常の文字列を許可する', () => {
    const schema = safeString({ min: 1, max: 50 });
    expect(schema.safeParse('東京タワー').success).toBe(true);
  });

  it('禁止文字を拒否する', () => {
    const schema = safeString({ min: 1 });
    const result = schema.safeParse('<script>');
    expect(result.success).toBe(false);
  });

  it('min制約を適用する', () => {
    const schema = safeString({ min: 3 });
    expect(schema.safeParse('ab').success).toBe(false);
    expect(schema.safeParse('abc').success).toBe(true);
  });

  it('max制約を適用する', () => {
    const schema = safeString({ max: 5 });
    expect(schema.safeParse('abcdef').success).toBe(false);
    expect(schema.safeParse('abcde').success).toBe(true);
  });

  it('オプションなしで動作する', () => {
    const schema = safeString();
    expect(schema.safeParse('test').success).toBe(true);
    expect(schema.safeParse('').success).toBe(true); // minなし
  });
});

describe('safeEmail', () => {
  it('有効なメールアドレスを許可する', () => {
    const schema = safeEmail({ max: 128 });
    expect(schema.safeParse('user@example.com').success).toBe(true);
  });

  it('無効なメールアドレスを拒否する', () => {
    const schema = safeEmail();
    expect(schema.safeParse('not-an-email').success).toBe(false);
  });

  it('禁止文字を含むメールアドレスを拒否する', () => {
    const schema = safeEmail();
    // containsForbidden checks for < > ' " ` ; $ | \\ -- \0 /*
    const result = schema.safeParse('user<xss>@example.com');
    expect(result.success).toBe(false);
  });
});

describe('safeUrl', () => {
  it('有効なURLを許可する', () => {
    const schema = safeUrl({ max: 200 });
    expect(schema.safeParse('https://example.com/path').success).toBe(true);
  });

  it('無効なURLを拒否する', () => {
    const schema = safeUrl();
    expect(schema.safeParse('not-a-url').success).toBe(false);
  });
});
