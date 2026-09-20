import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts', 'src/utils.ts'],
  // ESM only. Consumers are Hono apps; shipping CJS as well would double the
  // surface for no gain (6.6).
  format: ['esm'],
  dts: true,
  clean: true,
  outDir: 'dist',
  platform: 'neutral',
  treeshake: true,
  // JSX is compiled here, against `hono/jsx`'s automatic runtime, so consumers
  // can import the components without any tsconfig of their own (6.6). The
  // settings come from tsconfig.json: `jsx: react-jsx`, `jsxImportSource: hono/jsx`.
  //
  // `hono` is a peer dependency and stays external, so the app's instance is
  // the only one (3.1). `@cloudensis/prose/class` is a devDependency and is
  // inlined instead: it keeps `dependencies` empty (6.2) while the ui -> prose
  // edge stays a typed import at authoring time (5.9).
  deps: { neverBundle: ['hono', /^hono\//] },
})
