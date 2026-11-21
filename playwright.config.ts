import { defineConfig } from "@playwright/test";

export default defineConfig({
	testDir: "tests",
	forbidOnly: !!process.env.CI,
	reporter: process.env.CI ? "github" : "list",
	use: {
		baseURL: "http://localhost:5173",
		browserName: "chromium",
		/* インストール済みの Chromium を使う場合に指定する。 */
		launchOptions: { executablePath: process.env.CHROMIUM_PATH },
	},
	/* サイドメニューの表示が変わるため、PC とスマホの幅で検査する。 */
	projects: [
		{ name: "desktop", use: { viewport: { width: 1280, height: 800 } } },
		{ name: "mobile", use: { viewport: { width: 390, height: 844 } } },
	],
	webServer: {
		/* cf dev は vite に委譲する。cf dev を止めても vite が残り終了しないため、vite を直接起動する。 */
		command: "vite --port 5173 --strictPort",
		url: "http://localhost:5173",
		reuseExistingServer: !process.env.CI,
	},
});
