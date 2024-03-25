import { defineConfig } from 'vite'
import eslintPlugin from "@nabla/vite-plugin-eslint";

export default defineConfig({
  build: {
    sourcemap: true,
    lib: {
      entry: './lib/main.ts',
      formats: ['es']
    },
    rollupOptions: {
      // don't include dom-utils in the bundled NPM package
      external: ['@fizz/dom-utils']
    }
  },
  plugins: [eslintPlugin()]
})
