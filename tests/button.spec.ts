import { expect, test } from "@playwright/test";

test.describe("LinkButton", () => {
	test("disabled にすると href を外し、キーボードでも遷移しない", async ({
		page,
	}) => {
		await page.goto("/components/button");
		const link = page.getByRole("link", { name: "default disabled" });
		await expect(link).toHaveAttribute("aria-disabled", "true");
		await expect(link).not.toHaveAttribute("href");

		await link.focus();
		await page.keyboard.press("Enter");
		await expect(page).toHaveURL(/\/components\/button$/);
	});
});
