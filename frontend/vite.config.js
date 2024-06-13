import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
import commonjs from 'vite-plugin-commonjs';
import vitePluginRequire from "vite-plugin-require";

// https://vitejs.dev/config/

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    commonjs(),
    eslint({
      lintOnStart: true,
      failOnError: mode === "production"
    }),
    vitePluginRequire.default()
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:8000'
    },
    open: true
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true
    }
  }
}));
