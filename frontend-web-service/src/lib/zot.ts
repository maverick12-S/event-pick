// Minimal wrapper for the installed `zot` package.
// Purpose: provide a stable import point and small helpers so callers
// can migrate to stricter schema validation later.

/* eslint-disable @typescript-eslint/no-explicit-any */

// Use require to avoid depending on TS types shipped by the package.
const zotLib = require('zot') as any;

export const zot = zotLib;

export type ZotSchema<T = any> = any;

export const parse = <T = any>(schema: ZotSchema, data: unknown): T => {
  if (!schema) throw new Error('schema is required');
  if (typeof schema.parse === 'function') {
    return schema.parse(data) as T;
  }
  if (typeof schema.safeParse === 'function') {
    const res = schema.safeParse(data);
    if (res && res.success) return res.data as T;
    throw new Error(res?.error?.message || 'validation failed');
  }
  // Fallback: assume schema is a function
  if (typeof schema === 'function') return (schema as any)(data) as T;
  throw new Error('schema parse not supported');
};

export const safeParse = <T = any>(schema: ZotSchema, data: unknown): { success: true; data: T } | { success: false; error: any } => {
  try {
    const parsed = parse<T>(schema, data);
    return { success: true, data: parsed };
  } catch (err) {
    return { success: false, error: err };
  }
};

export default zot;
