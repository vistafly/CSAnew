import { defineConfig } from 'vite'

export default defineConfig({
  // Vite automatically loads .env files and exposes VITE_ prefixed variables
  // No additional configuration needed for environment variables
  
  // Optional: Configure the development server
  server: {
    port: 3000,
    open: true // Automatically open browser
  },
  
  // Optional: Configure build output
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})