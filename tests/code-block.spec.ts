import { expect, test } from "@playwright/test";

test.describe("CodeBlock のコピーボタン", () => {
	test.beforeEach(async ({ page, context }) => {
		await context.grantPermissions(["clipboard-read", "clipboard-write"]);
		await page.goto("/components/code-block");
	});

	test("インラインハンドラーを使わない", async ({ page }) => {
		await expect(page.locator("[onclick]")).toHaveCount(0);
	});

	test("押すとコードをコピーし、2 秒後に元に戻る", async ({ page }) => {
		const block = page.locator("pre").first();
		/* コピー後は名前が変わるため、名前ではなく属性で探す。 */
		const button = block.locator("[data-code-block-copy]");
		await expect(button).toBeVisible();
		await expect(button).toHaveAccessibleName("コードをコピー");

		await button.click();
		await expect(button).toHaveAttribute("data-copied", "");
		await expect(button).toHaveAccessibleName("コピーしました");
		const copied = await page.evaluate(() => navigator.clipboard.readText());
		expect(copied).toBe(await block.locator("code").textContent());

		await expect(button).not.toHaveAttribute("data-copied", { timeout: 3000 });
	});

	test("続けて押しても、読み上げの文言を出し直す", async ({ page }) => {
		const block = page.locator("pre").first();
		const button = block.locator("[data-code-block-copy]");
		await button.click();
		await expect(button).toHaveAttribute("data-copied", "");

		/* 2 回目は、いったん外れてから付く。 */
		const removed = page.waitForFunction(
			(el) => !el?.hasAttribute("data-copied"),
			await button.elementHandle(),
		);
		await button.click();
		await removed;
		await expect(button).toHaveAttribute("data-copied", "");
	});
});
