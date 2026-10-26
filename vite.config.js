import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { publicUrls } from './build/public-urls.js'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), publicUrls(env)],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: env.API_PROXY_TARGET || 'http://localhost:8000',
          changeOrigin: true,
        },
      },
    },
    ssr: { noExternal: true },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            motion: ['motion/react'],
          },
        },
      },
      chunkSizeWarningLimit: 600,
    },
  }
})
