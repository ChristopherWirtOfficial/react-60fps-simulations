import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";

import jotaiDebugLabel from 'jotai/babel/plugin-debug-label'
import jotaiReactRefresh from 'jotai/babel/plugin-react-refresh'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 2000,
  },
  plugins: [react({ babel: { plugins: [jotaiDebugLabel, jotaiReactRefresh] } })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, './src'),
      "@components": path.resolve(__dirname, './src/components'),
      "hooks": path.resolve(__dirname, './src/hooks'),
      "atoms": path.resolve(__dirname, './src/atoms'),
      "helpers": path.resolve(__dirname, './src/helpers.ts'),
    }
  }
})
