import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/my-project', // ✅ Required for Netlify/static hosting
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    allowedHosts: [
      'wachatfinal.onrender.com',
      'bb7a-2401-4900-1c7b-7fa8-1003-9674-6424-5de0.ngrok-free.app',
    ],
    cors: {
      origin: [
        'http://localhost:5173',
        'https://bb7a-2401-4900-1c7b-7fa8-1003-9674-6424-5de0.ngrok-free.app',
        'https://wachatfinal.onrender.com',
      ],
      credentials: true,
    },
    proxy: {
      '/api': {
        target: 'https://bb7a-2401-4900-1c7b-7fa8-1003-9674-6424-5de0.ngrok-free.app',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  preview: {
    host: '0.0.0.0',
    allowedHosts: [
      'wachatfinal.onrender.com',
      'bb7a-2401-4900-1c7b-7fa8-1003-9674-6424-5de0.ngrok-free.app',
    ],
    cors: {
      origin: [
        'https://bb7a-2401-4900-1c7b-7fa8-1003-9674-6424-5de0.ngrok-free.app',
        'https://wachatfinal.onrender.com',
      ],
      credentials: true,
    },
  },
});
