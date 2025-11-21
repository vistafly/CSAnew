import { defineConfig } from 'vite'

export default defineConfig({
  // Use root path for local development, CSAnew for production
  base: process.env.NODE_ENV === 'production' ? '/CSAnew/' : '/',
  
  server: {
    port: 3000,
    open: true
  },
  
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Ensure proper asset handling
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: undefined,
      }
    }
  }
})