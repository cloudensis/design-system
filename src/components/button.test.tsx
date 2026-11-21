import { describe, expect, it } from "vitest";
import { Button, LinkButton } from "./button.tsx";

const render = (element: unknown) => String(element);

describe("Button", () => {
	it("variant と size ごとに別のクラスになる", () => {
		const outline = render(<Button variant="outline">a</Button>);
		const sm = render(<Button size="sm">a</Button>);
		expect(render(<Button>a</Button>)).not.toBe(outline);
		expect(render(<Button>a</Button>)).not.toBe(sm);
	});

	it("class は既定のクラスに追加される", () => {
		const html = render(<Button class="extra">a</Button>);
		expect(html).toMatch(/class="[^"]+ extra"/);
	});

	it("ほかの属性はそのまま渡す", () => {
		const html = render(
			<Button disabled aria-label="閉じる">
				a
			</Button>,
		);
		expect(html).toContain("disabled");
		expect(html).toContain('aria-label="閉じる"');
	});
});

describe("LinkButton", () => {
	it("a 要素で、記事用スタイルを受けない", () => {
		const html = render(<LinkButton href="/">a</LinkButton>);
		expect(html).toMatch(/^<a /);
		expect(html).toContain('href="/"');
		expect(html).toMatch(/class="not-prose /);
	});
});
