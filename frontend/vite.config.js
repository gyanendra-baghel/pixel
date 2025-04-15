import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  plugins: [
    react(),
    AutoImport({
      imports: ['react'], // Auto-imports React
      dts: 'src/auto-imports.d.ts',
    }),
  ],
  assetsInclude: ['**/*.JPG'], // ✅ Ensures .JPG files are treated as assets
})
