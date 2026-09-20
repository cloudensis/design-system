import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
	resolve: { alias: { "#/": "/" } },
	build: { outDir: "docs-dist" },
	plugins: [cloudflare(), tailwindcss()],
});
