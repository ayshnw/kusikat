import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// paksa host dan port supaya bisa diakses juga via 127.0.0.1
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1', // atau '0.0.0.0' jika mau expose ke network
    port: 5173
  },
})
