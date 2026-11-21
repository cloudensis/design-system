import { expect, test } from "@playwright/test";
import { nav } from "../docs/nav.ts";

const paths = nav.flatMap((group) => group.items.map((item) => item.href));

for (const path of paths) {
	test(`${path} がセキュリティヘッダーを返し、CSP に違反しない`, async ({
		page,
	}) => {
		const violations: string[] = [];
		await page.exposeFunction("reportViolation", (message: string) => {
			violations.push(message);
		});
		await page.addInitScript(() => {
			document.addEventListener("securitypolicyviolation", (event) => {
				const report = (
					window as unknown as { reportViolation: (m: string) => void }
				).reportViolation;
				report(`${event.violatedDirective}: ${event.blockedURI}`);
			});
		});

		const response = await page.goto(path);
		const headers = response?.headers() ?? {};
		expect(headers["content-security-policy"]).toContain("script-src 'self'");
		expect(headers["x-content-type-options"]).toBe("nosniff");

		await page.waitForLoadState("networkidle");
		expect(violations).toEqual([]);
	});
}
