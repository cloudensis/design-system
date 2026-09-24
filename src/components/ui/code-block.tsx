import { Fragment, type JSX } from "hono/jsx";
import { type CodeLanguage, highlight } from "../../lib/highlight.ts";
import { cn } from "../../lib/utils.ts";
import { CheckIcon } from "../icon/check.tsx";
import { CopyIcon } from "../icon/copy.tsx";

const variants = {
	variant: {
		default: cn(
			"overflow-x-auto rounded-sm border border-code-border bg-code-bg p-4 pr-12 text-code-fg text-sm",
		),
	},
};

/* SSR でも CSR でも属性として出力され、ハイドレーションなしで動くよう文字列にする。 */
const copyScript =
	"const b=this,c=b.parentElement.querySelector('code'),s=()=>getSelection().selectAllChildren(c);" +
	"navigator.clipboard?navigator.clipboard.writeText(c.textContent).then(()=>{" +
	"b.dataset.copied='';clearTimeout(b.t);b.t=setTimeout(()=>delete b.dataset.copied,2000)},s):s()";

type CodeBlockProps = Omit<JSX.IntrinsicElements["pre"], "children"> & {
	class?: string;
	/** 省略するとハイライトしない。 */
	lang?: CodeLanguage;
	variant?: keyof typeof variants.variant;
	children: string;
};

export function CodeBlock({
	variant = "default",
	lang,
	class: className,
	children,
	...props
}: CodeBlockProps) {
	/* テンプレートリテラルの前後の空行を落とす。 */
	const code = children.replace(/^[\r\n]+/, "").trimEnd();
	const lines = lang ? highlight(code, lang) : undefined;

	return (
		<div data-slot="code-block-container" class="relative">
			{/* キーボードで横スクロールできるように。 */}
			<pre
				data-slot="code-block"
				tabindex={0}
				class={cn(variants.variant[variant], className)}
				{...props}
			>
				<code>
					{lines
						? lines.map((line, index) => (
								/* 要素で囲むとコピー時に改行が失われるため。 */
								<Fragment key={String(index)}>
									{index > 0 ? "\n" : null}
									{line.map((token, tokenIndex) => (
										<span key={String(tokenIndex)} style={token.style}>
											{token.content}
										</span>
									))}
								</Fragment>
							))
						: code}
				</code>
			</pre>
			{/* pre の外に置き、横スクロールしても右上に留める。 */}
			<button
				data-slot="code-block-copy"
				type="button"
				class="group/copy absolute top-2 right-2 inline-flex cursor-pointer items-center justify-center rounded-sm border border-code-border bg-code-bg p-1.5 text-code-fg opacity-70 transition-opacity hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-code-fg"
				onclick={copyScript}
			>
				<CopyIcon class="size-4 group-data-copied/copy:hidden" />
				<CheckIcon class="hidden size-4 group-data-copied/copy:block" />
				<span class="sr-only group-data-copied/copy:hidden">コピー</span>
				<span class="sr-only hidden group-data-copied/copy:inline">
					コピーしました
				</span>
			</button>
		</div>
	);
}
