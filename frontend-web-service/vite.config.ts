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
    setupFiles: './src/setupTests.ts'
  }
})
