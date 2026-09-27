import type { JSX } from "hono/jsx";
import { CheckIcon } from "../icons/check.tsx";
import { CopyIcon } from "../icons/copy.tsx";
import { type CodeLanguage, highlight } from "../lib/highlight.ts";
import { cn } from "../lib/utils.ts";

type CodeBlockProps = Omit<JSX.IntrinsicElements["pre"], "children"> & {
	class?: string;
	/** 省略するとハイライトしない。 */
	lang?: CodeLanguage;
	children: string;
};

export function CodeBlock({
	lang,
	class: className,
	children,
	...props
}: CodeBlockProps) {
	/* テンプレートリテラルの前後の空行を落とす。 */
	const code = children.replace(/^[\r\n]+/, "").trimEnd();

	return (
		<pre
			class={cn(
				"not-prose relative rounded-sm bg-emphasis text-on-emphasis text-sm leading-[1.7]",
				className,
			)}
			{...props}
		>
			{/* 横スクロールは code が担う。tabindex はキーボードでスクロールするため。 */}
			<code tabindex={0} class="block overflow-x-auto p-4 pr-12">
				{renderCode(code, lang)}
			</code>
			<CopyButton />
		</pre>
	);
}

function renderCode(code: string, lang?: CodeLanguage) {
	const lines = lang && highlight(code, lang);
	if (!lines) return code;

	/* 要素で囲むとコピー時に改行が失われるため。 */
	return lines.map((line, index) => (
		<>
			{index > 0 && "\n"}
			{line.map((token) => (
				<span style={token.style}>{token.content}</span>
			))}
		</>
	));
}

/*
 * ハイドレーションなしで動くよう、インラインハンドラーの文字列にする。
 * 変えると CSP のハッシュが変わるので、利用側で CSP の設定を更新する必要がある。
 */
const copyScript = [
	"const button = this;",
	"const code = button.parentElement.querySelector('code');",
	"const selectAll = () => getSelection().selectAllChildren(code);",
	"if (!navigator.clipboard) return selectAll();",
	"navigator.clipboard.writeText(code.textContent).then(() => {",
	"button.dataset.copied = '';",
	"clearTimeout(button.timer);",
	"button.timer = setTimeout(() => delete button.dataset.copied, 2000);",
	"}, selectAll);",
].join("");

function CopyButton() {
	return (
		<button
			type="button"
			class="group/copy absolute top-2 right-2 inline-flex cursor-pointer items-center justify-center rounded-sm border border-current/30 bg-emphasis p-1.5 text-on-emphasis opacity-70 transition-opacity hover:opacity-100 focus-visible:opacity-100"
			onclick={copyScript}
		>
			<CopyIcon class="group-data-copied/copy:hidden" />
			<CheckIcon class="hidden group-data-copied/copy:block" />
			<span class="sr-only group-data-copied/copy:hidden">コピー</span>
			<span class="sr-only hidden group-data-copied/copy:inline">
				コピーしました
			</span>
		</button>
	);
}
