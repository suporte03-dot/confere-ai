import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ensureCategoriaImages } from './scripts/ensure-categoria-images.mjs'

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
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/confere-ai/' : '/',
  plugins: [react(), categoriaImagesPlugin()],
  server: {
    port: 5176,
    strictPort: false,
    open: false,
  },
}))
