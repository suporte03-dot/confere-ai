import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ensureCategoriaImages } from './scripts/ensure-categoria-images.mjs'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

function categoriaImagesPlugin() {
  return {
    name: 'terraestilo-categoria-images',
    async buildStart() {
      await ensureCategoriaImages()
    },
    async configureServer() {
      await ensureCategoriaImages()
    },
  }
}

// https://vite.dev/config/
// GitHub Pages project site: https://suporte03-dot.github.io/confere-ai/
// Vercel / local / default: site at domain root `/`
export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? '/confere-ai/' : '/',
  plugins: [react(), categoriaImagesPlugin()],
  resolve: {
    alias: {
      // Shared chrome uses Next APIs; Vite maps them to react-router shims.
      'next/link': path.resolve(rootDir, 'src/shims/next-link.jsx'),
      'next/navigation': path.resolve(rootDir, 'src/shims/next-navigation.js'),
    },
  },
  server: {
    port: 5176,
    strictPort: false,
    open: false,
  },
})
