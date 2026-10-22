import { defineConfig } from "cf/config";

/* ランタイム側の設定。アセットの置き場所は wrangler.config.ts で指定する。 */
export default defineConfig({
	worker: {
		name: "cloudensis-design-system-docs",
		compatibilityDate: "2026-09-16",
		assets: {
			htmlHandling: "auto-trailing-slash",
			notFoundHandling: "none",
		},
	},
});
