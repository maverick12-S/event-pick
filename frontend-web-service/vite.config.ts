import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // サンドボックス環境でのリバースプロキシアクセスを許可
    allowedHosts: true,
    host: '0.0.0.0',
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/__tests__/**',
        'src/**/*.test.*',
        'src/**/*.d.ts',
        'src/types/dto/**',
        'src/types/entities/**',
        'src/types/models/**',
        'src/types/auth.ts',
        'src/main.tsx',
        'src/setupTests.ts',
        'src/api/openapiClient.ts',
        'src/vite-env.d.ts',
      ],
    },
  }
})
