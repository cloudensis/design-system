import devServer from "@hono/vite-dev-server";
import ssg from "@hono/vite-ssg";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

const entry = "docs/index.tsx";

export default defineConfig({
	build: {
		outDir: "docs-dist",
		rollupOptions: {
			/* @hono/vite-ssg は HTML だけを書き出すため、CSS とフォントは別の入力としてビルドする。 */
			input: ["docs/style.css"],
			output: {
				/* アプリから CSS を参照できるよう、CSS のファイル名にはハッシュを付けない。 */
				assetFileNames: ({ names }) =>
					names[0]?.endsWith(".css")
						? "assets/[name][extname]"
						: "assets/[name]-[hash][extname]",
			},
		},
	},
	publicDir: "src/assets",
	plugins: [tailwindcss(), devServer({ entry }), ssg({ entry })],
});
