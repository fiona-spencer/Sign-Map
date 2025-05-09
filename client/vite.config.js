import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        secure: false,
      },
    },
  },
  build: {
    outDir: path.resolve(__dirname, '../api/public'), // build output goes to backend
    emptyOutDir: true,
  },
  base: '/', // optional; only change if serving from a subpath
})
