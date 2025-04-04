import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'plugin-safe',
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['@elizaos/core', '@safe-global/sdk-starter-kit', 'viem'],
    },
  },
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],
}); 