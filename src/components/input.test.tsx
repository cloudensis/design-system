import { describe, expect, it } from "vitest";
import { Input } from "./input.tsx";

const classOf = (html: string) => html.match(/class="([^"]*)"/)?.[1];

describe("Input", () => {
	it("checkbox と radio は、テキスト入力と別のクラスになる", () => {
		const text = classOf(String(<Input />));
		const checkbox = classOf(String(<Input type="checkbox" />));
		const radio = classOf(String(<Input type="radio" />));
		expect(checkbox).toBe(radio);
		expect(checkbox).not.toBe(text);
		expect(classOf(String(<Input type="email" />))).toBe(text);
	});

	it("type をそのまま出力する", () => {
		expect(String(<Input type="email" />)).toContain('type="email"');
	});
});
