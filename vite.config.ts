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
		ssr: {
			build: {
				outDir,
				emitAssets: true,
				copyPublicDir: true,
				rolldownOptions: { input: { index: entry } },
			},
		},
	},
	builder: {
		/* アプリを CSS などのアセットと一緒にビルドし、HTML を書き出したらアプリは消す。 */
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
