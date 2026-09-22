import { Fragment, type JSX } from "hono/jsx";
import { type CodeLanguage, highlight } from "../../lib/highlight.ts";
import { cn } from "../../lib/utils.ts";
import { CheckIcon } from "../icon/check.tsx";
import { CopyIcon } from "../icon/copy.tsx";

const variants = {
	variant: {
		default: cn(
			"overflow-x-auto rounded border border-code-border bg-code-bg p-4 pr-12 text-code-fg text-sm",
		),
	},
};

/* コピーボタンの onclick に渡すクライアント JavaScript。関数ではなく文字列の
   インラインハンドラーにしているのは、hono/jsx の SSR（SSG を含む）では属性として
   そのまま HTML に出力され、hono/jsx/dom の CSR でも on + 小文字の属性は
   setAttribute で設定されるためです。これにより、ハイドレーションや別途の
   スクリプト読み込みなしに、どこから描画しても同じように動作します。

   クリップボード API が使えない環境（HTTP 配信など）や書き込みが拒否された
   場合は、コード全体を選択して Ctrl / Cmd + C でコピーできるようにします。
   コピーに成功すると data-copied を 2 秒間付与し、表示を切り替えます。 */
const copyScript =
	"const b=this,c=b.parentElement.querySelector('code'),s=()=>getSelection().selectAllChildren(c);" +
	"navigator.clipboard?navigator.clipboard.writeText(c.textContent).then(()=>{" +
	"b.dataset.copied='';clearTimeout(b.t);b.t=setTimeout(()=>delete b.dataset.copied,2000)},s):s()";

type CodeBlockProps = Omit<JSX.IntrinsicElements["pre"], "children"> & {
	class?: string;
	/** 省略するとハイライトせずそのまま表示します。 */
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
	/* JSX のテンプレートリテラルで前後に入りやすい空行を落とします。 */
	const code = children.replace(/^[\r\n]+/, "").trimEnd();
	const lines = lang ? highlight(code, lang) : undefined;

	return (
		<div data-slot="code-block-container" class="relative">
			{/* tabindex はキーボードで横スクロールできるようにするためです。 */}
			<pre
				data-slot="code-block"
				tabindex={0}
				class={cn(variants.variant[variant], className)}
				{...props}
			>
				<code>
					{lines
						? lines.map((line, index) => (
								/* 行の区切りは改行文字で表現します。要素で囲むと
								   コピー時に改行が失われるためです。 */
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
			{/* ボタンを pre の外に置くことで、横スクロールしても右上に留まります。
			    アイコンと読み上げ用の文言は data-copied の有無で CSS だけで切り替えます。 */}
			<button
				data-slot="code-block-copy"
				type="button"
				class="group/copy absolute top-2 right-2 inline-flex cursor-pointer items-center justify-center rounded border border-code-border bg-code-bg p-1.5 text-code-fg opacity-70 transition-opacity hover:opacity-100 focus-visible:opacity-100"
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
