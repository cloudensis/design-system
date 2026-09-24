import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const paths = ["/", "/tokens", "/components", "/prose", "/not-found"];

for (const path of paths) {
	test(`${path} にアクセシビリティの違反がない`, async ({ page }) => {
		await page.goto(path);
		const { violations } = await new AxeBuilder({ page })
			.withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
			.analyze();
		expect(
			violations.map(({ id, help, nodes }) => ({
				id,
				help,
				targets: nodes.map((node) => node.target.join(" ")),
			})),
		).toEqual([]);
	});
}
