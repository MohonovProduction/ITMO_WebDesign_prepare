import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// Имя будущего GitHub-репозитория. Если оно изменится, поменяйте base.
export default defineConfig({
  base: '/ITMO_WebDesign_prepare/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
