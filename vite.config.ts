/// <reference types="vitest/config" />
import path from "node:path";
import { cloudflare } from "@cloudflare/vite-plugin";
import { defineConfig } from "vite";
import ssrPlugin from "vite-ssr-components/plugin";

/* ドキュメントサイトの設定。パッケージのビルドは vite.lib.config.ts で行う。 */
export default defineConfig({
	/* パッケージで配布しているアセットを、そのままサイトでも配信する。 */
	publicDir: "src/assets",
	/* ドキュメントサイトから、配布物と同じパスでソースを import する。tsconfig.json の paths と合わせる。 */
	resolve: {
		alias: [
			{
				find: /^@cloudensis\/design-system\/(components|icons|brand)\/(.+)$/,
				replacement: path.resolve(import.meta.dirname, "src/$1/$2.tsx"),
			},
			{
				find: /^@cloudensis\/design-system\/lib\/(.+)$/,
				replacement: path.resolve(import.meta.dirname, "src/lib/$1.ts"),
			},
		],
	},
	plugins: [cloudflare(), ssrPlugin()],
	test: {
		include: ["docs/**/*.test.ts"],
	},
});
