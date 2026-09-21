import { Fragment, type JSX } from "hono/jsx";
import { type CodeLanguage, highlight } from "../../lib/highlight.ts";
import { cn } from "../../lib/utils.ts";
import { CopyIcon } from "../icon/copy.tsx";
import { Tooltip } from "./tooltip.tsx";

const variants = {
	variant: {
		default: cn(
			"cursor-pointer select-all overflow-x-auto rounded border border-border bg-surface p-4 text-sm",
		),
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
		<Tooltip
			class="block w-full"
			label={
				<>
					<CopyIcon class="size-3.5" />
					クリックで全選択
				</>
			}
		>
			{/* user-select: all（select-all）により、クリック 1 回でコード全体が選択
			    されます。あとは Ctrl / Cmd + C でコピーできるため、コピーのために
			    クライアント JavaScript を読み込む必要がありません。
			    tabindex はキーボードでの横スクロールとツールチップの表示のためです。 */}
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
		</Tooltip>
	);
}
