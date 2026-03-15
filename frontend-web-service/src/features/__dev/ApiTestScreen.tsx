/**
 * 開発用 API 疎通テスト画面
 * - /dev/api-test でアクセス
 * - 認証不要エンドポイントを叩いてバックエンドとの接続を確認
 * - 本番デプロイ前に削除すること
 */
import { useState } from 'react';
import { apiClient } from '../../api/http';

type TestResult = {
  endpoint: string;
  status: 'idle' | 'loading' | 'success' | 'error';
  statusCode?: number;
  data?: unknown;
  error?: string;
  latency?: number;
};

const TEST_ENDPOINTS = [
  { label: '拠点アカウント一覧', method: 'GET' as const, path: '/company-accounts?limit=5&page=1' },
  { label: '都道府県マスタ', method: 'GET' as const, path: '/master/prefectures' },
  { label: '市区町村（東京）', method: 'GET' as const, path: '/master/cities?prefectureCode=13' },
] as const;

export default function ApiTestScreen() {
  const [results, setResults] = useState<TestResult[]>(
    TEST_ENDPOINTS.map((ep) => ({ endpoint: `${ep.method} ${ep.path}`, status: 'idle' })),
  );

  const runTest = async (index: number) => {
    const ep = TEST_ENDPOINTS[index];
    setResults((prev) => prev.map((r, i) => (i === index ? { ...r, status: 'loading' } : r)));

    const start = performance.now();
    try {
      const res = await apiClient.get(ep.path);
      const latency = Math.round(performance.now() - start);
      setResults((prev) =>
        prev.map((r, i) =>
          i === index
            ? { ...r, status: 'success', statusCode: res.status, data: res.data, latency }
            : r,
        ),
      );
    } catch (err: unknown) {
      const latency = Math.round(performance.now() - start);
      const msg = err instanceof Error ? err.message : String(err);
      const statusCode = (err as { response?: { status?: number } })?.response?.status;
      setResults((prev) =>
        prev.map((r, i) =>
          i === index ? { ...r, status: 'error', error: msg, statusCode, latency } : r,
        ),
      );
    }
  };

  const runAll = async () => {
    for (let i = 0; i < TEST_ENDPOINTS.length; i++) {
      await runTest(i);
    }
  };

  return (
    <div style={{ padding: 32, fontFamily: 'monospace', maxWidth: 960, margin: '0 auto' }}>
      <h1 style={{ fontSize: 20, marginBottom: 8 }}>🔌 API 疎通テスト</h1>
      <p style={{ color: '#888', marginBottom: 24 }}>
        バックエンド (localhost:8080) との接続をテストします
      </p>

      <button
        onClick={runAll}
        style={{
          padding: '8px 24px',
          background: '#2563eb',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          cursor: 'pointer',
          fontSize: 14,
          marginBottom: 24,
        }}
      >
        ▶ 全テスト実行
      </button>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #333', textAlign: 'left' }}>
            <th style={{ padding: 8 }}>エンドポイント</th>
            <th style={{ padding: 8 }}>ステータス</th>
            <th style={{ padding: 8 }}>レイテンシ</th>
            <th style={{ padding: 8 }}>操作</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: 8 }}>
                <strong>{TEST_ENDPOINTS[i].label}</strong>
                <br />
                <span style={{ color: '#888', fontSize: 12 }}>{r.endpoint}</span>
              </td>
              <td style={{ padding: 8 }}>
                {r.status === 'idle' && <span style={{ color: '#888' }}>—</span>}
                {r.status === 'loading' && <span style={{ color: '#f59e0b' }}>⏳ 実行中...</span>}
                {r.status === 'success' && (
                  <span style={{ color: '#22c55e' }}>✅ {r.statusCode}</span>
                )}
                {r.status === 'error' && (
                  <span style={{ color: '#ef4444' }}>
                    ❌ {r.statusCode ?? 'N/A'} {r.error}
                  </span>
                )}
              </td>
              <td style={{ padding: 8, color: '#888' }}>
                {r.latency != null ? `${r.latency}ms` : '—'}
              </td>
              <td style={{ padding: 8 }}>
                <button
                  onClick={() => runTest(i)}
                  style={{
                    padding: '4px 12px',
                    background: '#374151',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 4,
                    cursor: 'pointer',
                    fontSize: 12,
                  }}
                >
                  実行
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {results.some((r) => r.data) && (
        <div style={{ marginTop: 32 }}>
          <h2 style={{ fontSize: 16, marginBottom: 8 }}>レスポンス詳細</h2>
          {results
            .filter((r) => r.data)
            .map((r, i) => (
              <details key={i} style={{ marginBottom: 12 }}>
                <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                  {r.endpoint}
                </summary>
                <pre
                  style={{
                    background: '#1e1e2e',
                    color: '#a6e3a1',
                    padding: 12,
                    borderRadius: 6,
                    overflow: 'auto',
                    maxHeight: 300,
                    fontSize: 12,
                  }}
                >
                  {JSON.stringify(r.data, null, 2)}
                </pre>
              </details>
            ))}
        </div>
      )}
    </div>
  );
}
