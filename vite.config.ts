import devServer from "@hono/vite-dev-server";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

const entry = "docs/index.tsx";

export default defineConfig({
	/* HTML の書き出しに使うアプリを、CSS やフォントと一緒にビルドする。 */
	build: { ssr: entry, outDir: "docs-dist", emitAssets: true },
	publicDir: "src/assets",
	plugins: [tailwindcss(), devServer({ entry })],
});
