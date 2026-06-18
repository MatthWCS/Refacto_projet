import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@assets": "/src/assets",
      "@components": "/src/components",
      "@ui": "/src/components/ui",
      "@shared": "/src/components/shared",
      "@pages": "/src/pages",
      "@store": "/src/store",
      "@apiSlice": "/src/store/apislice",
      "@slice": "/src/store/slice",
      "@utils": "/src/utils"
    }
  }
})
