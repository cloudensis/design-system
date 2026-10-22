import { defineConfig } from "cf/config";

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
