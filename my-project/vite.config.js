import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Allows external connections
    allowedHosts: [
      '0b10-2401-4900-1c7b-7fa8-b8b8-5dee-e39-386.ngrok-free.app' // Add your ngrok domain here
    ],
    cors: {
      origin: [
        'http://localhost:5173', // Your local dev
        'https://0b10-2401-4900-1c7b-7fa8-b8b8-5dee-e39-386.ngrok-free.app', // Your ngrok URL with https
      ],
      credentials: true
    },
    // If you need to proxy API requests
    proxy: {
      '/api': {
        target: 'https://0b10-2401-4900-1c7b-7fa8-b8b8-5dee-e39-386.ngrok-free.app',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  preview: {
    host: '0.0.0.0',
    allowedHosts: [
      '0b10-2401-4900-1c7b-7fa8-b8b8-5dee-e39-386.ngrok-free.app'
    ],
    cors: {
      origin: [
        'https://0b10-2401-4900-1c7b-7fa8-b8b8-5dee-e39-386.ngrok-free.app'
      ],
      credentials: true
    }
  }
})