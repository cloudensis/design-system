import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/class.ts'],
  format: ['esm'],
  dts: true,
  clean: false,
  outDir: 'dist',
  platform: 'neutral',
  treeshake: true,
})
