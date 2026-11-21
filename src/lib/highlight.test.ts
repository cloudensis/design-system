/// <reference types="node" />
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { type CodeLanguage, codeLanguages, highlight } from "./highlight.ts";

/* コードブロックの背景。トークンと同じ値を使うよう colors.css から読む。 */
const background = readFileSync(
	`${import.meta.dirname}/../styles/colors.css`,
	"utf8",
).match(/--background-color-emphasis:\s*(#[0-9a-f]{6})/i)?.[1];

const luminance = (hex: string) => {
	const [r, g, b] = [1, 3, 5].map((i) => {
		const c = Number.parseInt(hex.slice(i, i + 2), 16) / 255;
		return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
	});
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (a: string, b: string) => {
	const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
	return (light + 0.05) / (dark + 0.05);
};

/* 文字列・コメント・キーワード・関数・数値・タグ・属性など、なるべく多くの種類のトークンを含める。 */
const samples: Record<string, string> = {
	tsx: `// comment
/** doc */
import { a, type B } from "mod";
export async function f<T>(x: number = 1, ...rest: T[]): Promise<void> {
	const re = /a[b-d]+cd/gi;
	let s = \`t \${x}\`;
	if (x > 0 && !null) return await g?.(x as any, true, undefined);
	class C extends D { #p = 0; static m() { return this; } }
	const el = <div className="x" onClick={() => {}}>{s}</div>;
}`,
	css: `/* c */ @import "x.css"; .a:hover > #b::before { color: #fff !important; margin: 1px calc(2em + 3%); --v: var(--w); }`,
	html: `<!doctype html><!-- c --><a href="/" data-x='y'>&amp; t</a><script>let a = 1;</script><style>.a{color:red}</style>`,
	json: `{ "a": 1, "b": [true, null, "s"], "c": { "d": -1.5e3 } }`,
	markdown: `# H\n\n**b** _i_ \`c\` [l](u)\n\n- item\n\n> q\n\n\`\`\`ts\nconst a = 1;\n\`\`\``,
	shellscript: `#!/bin/bash\n# c\nexport A="x $B" && echo 'y' | grep -E "z" > /dev/null 2>&1; for i in 1 2; do $(ls); done`,
	yaml: `# c\nkey: value\nlist:\n  - 1\n  - true\nanchor: &a { x: "s" }\nref: *a`,
};

describe("highlight", () => {
	it("背景色を colors.css から読める", () => {
		expect(background).toMatch(/^#[0-9a-f]{6}$/i);
	});

	it.each(Object.entries(samples))(
		"%s のすべてのトークンが、背景とのコントラスト比 4.5 以上",
		(lang, code) => {
			const lines = highlight(code, lang as CodeLanguage);
			expect(lines).toBeDefined();
			const colors = new Set(
				lines
					?.flat()
					.map((token) => token.style.match(/color:(#[0-9a-f]{6})/i)?.[1])
					.filter((color) => color !== undefined),
			);
			expect(colors.size).toBeGreaterThan(1);
			for (const color of colors) {
				expect
					.soft(contrast(color, background ?? ""), `${lang}: ${color}`)
					.toBeGreaterThanOrEqual(4.5);
			}
		},
	);

	it("codeLanguages の名前はすべてハイライトできる", () => {
		for (const name of Object.values(codeLanguages).flat()) {
			expect(highlight("a", name), name).toBeDefined();
		}
	});

	it("トークンの内容をつなげると元のコードに戻る", () => {
		const code = "const a = 1;\nconst b = 2;";
		const lines = highlight(code, "ts");
		expect(
			lines?.map((line) => line.map((t) => t.content).join("")).join("\n"),
		).toBe(code);
	});
});
