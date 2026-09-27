import type { JSX } from "hono/jsx";
import { CheckIcon } from "../icons/check.tsx";
import { CopyIcon } from "../icons/copy.tsx";
import { type CodeLanguage, highlight } from "../lib/highlight.ts";
import { cn } from "../lib/utils.ts";

/* ハイドレーションなしで動くよう、インラインハンドラーの文字列にする。 */
const copyScript =
	"const b=this,c=b.parentElement.querySelector('code'),s=()=>getSelection().selectAllChildren(c);" +
	"navigator.clipboard?navigator.clipboard.writeText(c.textContent).then(()=>{" +
	"b.dataset.copied='';clearTimeout(b.t);b.t=setTimeout(()=>delete b.dataset.copied,2000)},s):s()";

type CodeProps = {
	code: string;
	lang?: CodeLanguage;
};

function Code({ code, lang }: CodeProps) {
	const lines = lang ? highlight(code, lang) : undefined;

	return (
		/* 横スクロールは code が担う。tabindex はキーボードでスクロールするため。 */
		<code tabindex={0} class="block overflow-x-auto p-4 pr-12">
			{lines
				? lines.map((line, index) => (
						/* 要素で囲むとコピー時に改行が失われるため。 */
						<>
							{index > 0 && "\n"}
							{line.map((token) => (
								<span style={token.style}>{token.content}</span>
							))}
						</>
					))
				: code}
		</code>
	);
}

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
				"relative overflow-visible rounded-sm bg-emphasis p-0 text-on-emphasis text-sm leading-[1.7]",
				className,
			)}
			{...props}
		>
			<Code code={code} lang={lang} />
			<CopyButton />
		</pre>
	);
}
