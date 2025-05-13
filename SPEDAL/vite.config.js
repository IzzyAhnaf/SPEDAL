import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  esbuild: { drop: process.env.NODE_ENV === 'production' ? ['console'] : [] },
  server: {
    host: '0.0.0.0',
    port: 5000,
    // proxy: {
    //   '/api': {
    //     target: ``,
    //     changeOrigin: true,
    //     secure: false,
    //   },
    // },
    cors: true,
  }
})
