import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
	build: { outDir: "docs-dist" },
	/* 利用側アプリと同じく、デザインシステムのアセットを自分のドメインから配信する。 */
	publicDir: "src/assets",
	plugins: [cloudflare(), tailwindcss()],
});
