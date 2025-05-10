import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

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
    outDir: 'dist', // put output in client/dist
    emptyOutDir: true,
  },
  base: '/', // only change if hosting from a subpath like /static/
})
