import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'
import { defineConfig } from 'vite'

// Older phones (iOS < 16.4, old Android WebView) got a white screen with Vite's default
// 2023+ target. Transpile down and add polyfills for what those browsers lack.
export default defineConfig({
  plugins: [
    react(),
    legacy({
      modernTargets: ['safari >= 13', 'ios_saf >= 13', 'chrome >= 80', 'android >= 80', 'firefox >= 78', 'samsung >= 13'],
      modernPolyfills: true,
      renderLegacyChunks: false,
    }),
  ],
})
