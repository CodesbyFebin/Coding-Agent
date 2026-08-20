import { defineConfig } from 'vite'
import react from '@vitejs/plugin/react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@features': resolve(__dirname, './src/features'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@lib': resolve(__dirname, './src/lib'),
      '@realtime': resolve(__dirname, './src/realtime'),
      '@stores': resolve(__dirname, './src/stores'),
      '@types': resolve(__dirname, './src/types'),
      '@utils': resolve(__dirname, './src/utils'),
      '@design-system': resolve(__dirname, './src/design-system')
    }
  },
  server: {
    port: 3000,
    strictPort: true,
    open: true
  },
  preview: {
    port: 3000
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@chakra-ui/react', '@chakra-ui/icons', 'framer-motion'],
          state: ['zustand', '@tanstack/react-query'],
          charts: ['recharts'],
          flow: ['react-flow-renderer'],
          forms: ['react-hook-form', 'zod']
        }
      }
    }
  }
})
