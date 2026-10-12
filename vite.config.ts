import fs from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import devServer from "@hono/vite-dev-server";
import tailwindcss from "@tailwindcss/vite";
import type { Hono } from "hono";
import { toSSG } from "hono/ssg";
import { defineConfig } from "vite";

const entry = "docs/index.tsx";
const outDir = "docs-dist";

export default defineConfig({
	publicDir: "src/assets",
	plugins: [tailwindcss(), devServer({ entry })],
	environments: {
		/* HTML を書き出すためのアプリを Node.js 向けにビルドする。 */
		ssr: {
			build: {
				outDir,
				/* ssr の既定では CSS やフォントを書き出さないため、明示する。 */
				emitAssets: true,
				rolldownOptions: { input: entry },
			},
		},
	},
	builder: {
		/* 既定の client のビルドの代わりに、アプリをビルドして HTML を書き出し、アプリは消す。 */
		async buildApp(builder) {
			await builder.build(builder.environments.ssr);
			const appPath = resolve(outDir, "index.js");
			const { default: app }: { default: Hono } = await import(
				pathToFileURL(appPath).href
			);
			const result = await toSSG(app, fs, { dir: outDir });
			await fs.rm(appPath);
			if (!result.success) throw result.error;
		},
	},
});
