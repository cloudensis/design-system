import { globSync } from "node:fs";
import { defineConfig } from "vite";

/* CSS Modules を処理するため、tsc ではなく Vite で配布物をビルドする。型定義は tsc で書き出す。 */
const entries = globSync("src/{components,brand,icons,lib}/**/*.{ts,tsx}");

export default defineConfig({
	build: {
		outDir: "dist",
		lib: {
			entry: entries,
			formats: ["es"],
			/* コンポーネントのスタイルは 1 ファイルにまとめる。 */
			cssFileName: "components",
		},
		rolldownOptions: {
			/* 依存パッケージは同梱しない。 */
			external: (id) => !id.startsWith(".") && !id.startsWith("/"),
			output: {
				preserveModules: true,
				preserveModulesRoot: "src",
				entryFileNames: "[name].js",
			},
		},
	},
});
