import { defineConfig } from 'vite'

export default defineConfig({
  // Set base path for GitHub Pages (replace 'your-repo-name' with actual repo name)
  base: '/CSAnew/',
  
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