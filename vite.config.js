import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // The "@/..." alias used throughout src/ was previously supplied by the
    // hosting provider's Vite plugin. jsconfig.json only tells the editor
    // about it — Vite needs it declared here to resolve imports at build time.
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
})
