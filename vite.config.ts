import devServer from "@hono/vite-dev-server";
import ssg from "@hono/vite-ssg";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

const entry = "docs/index.tsx";

export default defineConfig({
	build: {
		outDir: "docs-dist",
		/* HTML から参照するため、CSS はハッシュを付けずに書き出す。 */
		rolldownOptions: {
			input: ["docs/style.css"],
			output: {
				assetFileNames: ({ names }) =>
					names.some((name) => name.endsWith(".css"))
						? "assets/[name][extname]"
						: "assets/[name]-[hash][extname]",
			},
		},
	},
	publicDir: "src/assets",
	plugins: [tailwindcss(), devServer({ entry }), ssg({ entry })],
});
