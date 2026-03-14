/**
 * API サービス層 — 集約エクスポート
 * ─────────────────────────────────────────────
 * 全画面の API 導線を提供する。
 * 現在 mock 呼び出し → 将来的に実 API へ切替え時は
 * feature hooks 内の import を api/services/* に向けるだけ。
 *
 * パイプライン: 画面入力 → Zod バリデーション → DTO → API → レスポンス検証 → UI
 */

export { authApi } from './authApi';
export { accountApi } from './accountApi';
export { postApi } from './postApi';
export { planApi } from './planApi';
export { settingsApi } from './settingsApi';
export { reportApi } from './reportApi';
export { adminApi } from './adminApi';
export { agreementApi } from './agreementApi';
