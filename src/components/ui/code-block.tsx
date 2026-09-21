import { Fragment, type JSX } from "hono/jsx";
import { type CodeLanguage, highlight } from "../../lib/highlight.ts";
import { cn } from "../../lib/utils.ts";
import { CopyIcon } from "../icon/copy.tsx";

const variants = {
	variant: {
		default: cn("overflow-hidden rounded border border-border bg-surface"),
	},
};

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
		<div
			data-slot="code-block"
			class={cn("group", variants.variant[variant], className)}
		>
			{/* クリックで選択できることを示すラベル。コードに重ねると長い行が隠れて
			    しまうため、コードの上に独立した行として置いています。 */}
			<div
				data-slot="code-block-hint"
				class="flex select-none items-center justify-end gap-1 border-border border-b px-4 py-1.5 text-fg-muted text-xs transition-colors group-hover:text-fg"
			>
				<CopyIcon class="size-3.5" />
				クリックで全選択
			</div>
			{/* user-select: all（select-all）により、クリック 1 回でコード全体が選択
			    されます。あとは Ctrl / Cmd + C でコピーできるため、コピーのために
			    クライアント JavaScript を読み込む必要がありません。 */}
			<pre
				data-slot="code-block-pre"
				class="cursor-pointer select-all overflow-x-auto p-4 text-sm"
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
		</div>
	);
}
