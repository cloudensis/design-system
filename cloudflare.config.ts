import { defineConfig } from "cf/config";

export default defineConfig({
	worker: {
		name: "cloudensis-design-system-docs",
		compatibilityDate: "2026-10-30",
		entrypoint: "./docs/index.tsx",
	},
});
