import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
    VitePWA({ 
      registerType: 'autoUpdate',
      manifest: false // Since you already have a site.webmanifest file
    })
  ],
  resolve: {
    alias: {
      // This achieves the same thing as __dirname but works in ES Modules (more future-proof)
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
