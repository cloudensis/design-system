import { defineConfig } from "@playwright/test";

export default defineConfig({
	testDir: "tests",
	forbidOnly: !!process.env.CI,
	reporter: process.env.CI ? "github" : "list",
	use: {
		baseURL: "http://localhost:5173",
		browserName: "chromium",
		/* インストール済みの Chromium を使う場合はパスを指定します。 */
		launchOptions: { executablePath: process.env.CHROMIUM_PATH },
	},
	webServer: {
		command: "npm run dev -- --port 5173 --strictPort",
		url: "http://localhost:5173",
		reuseExistingServer: !process.env.CI,
	},
});
