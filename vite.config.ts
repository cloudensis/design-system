/// <reference types="vitest/config" />
import { cloudflare } from "@cloudflare/vite-plugin";
import { defineConfig } from "vite";
import ssrPlugin from "vite-ssr-components/plugin";

/* ドキュメントサイトの設定。パッケージのビルドは vite.lib.config.ts で行う。 */
export default defineConfig({
	/* パッケージで配布しているアセットを、そのままサイトでも配信する。 */
	publicDir: "src/assets",
	plugins: [cloudflare(), ssrPlugin()],
	test: {
		include: ["docs/**/*.test.ts"],
	},
});
