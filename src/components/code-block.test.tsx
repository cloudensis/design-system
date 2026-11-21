import { describe, expect, it } from "vitest";
import { CodeBlock } from "./code-block.tsx";

const codeOf = (html: string) =>
	html.match(/<code[^>]*>([\s\S]*?)<\/code>/)?.[1] ?? "";

describe("CodeBlock", () => {
	it("テンプレートリテラルの先頭の改行と末尾の空白を落とす", () => {
		const html = String(<CodeBlock>{"\n\nconst a = 1;\n  \n"}</CodeBlock>);
		expect(codeOf(html)).toBe("const a = 1;");
	});

	it("lang がなければハイライトせず、HTML をエスケープする", () => {
		const html = String(<CodeBlock>{"<script>alert(1)</script>"}</CodeBlock>);
		expect(codeOf(html)).toBe("&lt;script&gt;alert(1)&lt;/script&gt;");
	});

	it("lang があればトークンごとに色を付け、HTML をエスケープする", () => {
		const html = String(
			<CodeBlock lang="html">{"<script>alert(1)</script>"}</CodeBlock>,
		);
		const code = codeOf(html);
		expect(code).toMatch(/<span style="color:#[0-9A-F]{6}">/);
		expect(code).not.toContain("<script>");
		expect(code.replace(/<[^>]+>/g, "")).toBe(
			"&lt;script&gt;alert(1)&lt;/script&gt;",
		);
	});

	it("行を要素で囲まず、改行文字でつなぐ（コピーで改行を残すため）", () => {
		const html = String(<CodeBlock lang="ts">{"a\nb"}</CodeBlock>);
		expect(codeOf(html).replace(/<[^>]+>/g, "")).toBe("a\nb");
	});

	it("コピーボタンと、読み上げ用のライブ領域を出す", () => {
		const html = String(<CodeBlock>{"a"}</CodeBlock>);
		expect(html).toContain('aria-label="コードをコピー"');
		expect(html).toContain('role="status"');
	});
});
