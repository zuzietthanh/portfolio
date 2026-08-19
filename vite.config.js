import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import devApi from './vite-plugin-dev-api.js'

// https://vite.dev/config/
export default defineConfig({
  // devApi is serve-only: it runs the /api handlers Vercel hosts in production
  // so the feedback form can be exercised locally instead of first on the live site.
  plugins: [react(), devApi()],
  resolve: {
    // The "@/..." alias used throughout src/ was previously supplied by the
    // hosting provider's Vite plugin. jsconfig.json only tells the editor
    // about it — Vite needs it declared here to resolve imports at build time.
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
})
