import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
//If baseUrl is set to /api/notes, the request will be proxied to the backend 
// server running on http://localhost:3001 due to the proxy configuration in vite.config.js.
/* 
Changing the Proxy Target: If you change the proxy target in vite.config.js to http://localhost:3002:
when axios.get('/api/notes') is called, the request will still be sent to http://localhost:5173/api/notes, 
but Vite will forward this request to http://localhost:3002/api/notes instead of http://localhost:3001/api/notes.
Then if backend server still running on http://localhost:3001, the request will fail.
*/

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './testSetup.js', 
  },
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
})
