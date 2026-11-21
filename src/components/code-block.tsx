import type { JSX } from "hono/jsx";
import { CheckIcon } from "../icons/check.tsx";
import { CopyIcon } from "../icons/copy.tsx";
import type { Highlight } from "../lib/highlight.ts";
import { cn } from "../lib/utils.ts";
import styles from "./code-block.module.css";

/** createCodeBlock で作った CodeBlock の props。 */
export type HighlightedCodeBlockProps<L extends string = string> = Omit<
	JSX.IntrinsicElements["pre"],
	"children"
> & {
	class?: string;
	/** ハイライトする言語。省略するとハイライトしない。 */
	lang?: L;
	children: string;
};

export type CodeBlockProps<L extends string = string> =
	HighlightedCodeBlockProps<L> & {
		/**
		 * ハイライト関数。lang と一緒に渡すとハイライトする。
		 * 毎回渡す代わりに createCodeBlock で束ねられる。
		 */
		highlight?: Highlight<L>;
	};

/**
 * ハイライトしないコードブロック。Shiki を同梱しないので軽い。
 * ハイライトするときは highlight を渡すか、createCodeBlock を使う。
 */
export function CodeBlock<L extends string = string>({
	lang,
	highlight,
	class: className,
	children,
	...props
}: CodeBlockProps<L>) {
	/* テンプレートリテラルの前後の空行を落とす。 */
	const code = children.replace(/^[\r\n]+/, "").trimEnd();
	const lines = lang && highlight?.(code, lang);

	return (
		<pre class={cn("not-prose", styles.codeBlock, className)} {...props}>
			{/* tabindex はキーボードでスクロールするため。 */}
			<code tabindex={0} class={styles.code}>
				{lines ? renderLines(lines) : code}
			</code>
			<CopyButton />
		</pre>
	);
}

/**
 * ハイライト関数を束ねた CodeBlock を作る。アプリで 1 回だけ作って使い回す。
 *
 * @example
 * import { createCodeBlock } from "@cloudensis/design-system/components/code-block";
 * import { createHighlight } from "@cloudensis/design-system/lib/highlight";
 * import tsx from "@shikijs/langs/tsx";
 *
 * export const CodeBlock = createCodeBlock(createHighlight<"tsx">({ langs: [tsx] }));
 */
export function createCodeBlock<L extends string>(highlight: Highlight<L>) {
	return function HighlightedCodeBlock(props: HighlightedCodeBlockProps<L>) {
		return CodeBlock<L>({ ...props, highlight });
	};
}

/* 要素で囲むとコピー時に改行が失われるため。 */
function renderLines(lines: NonNullable<ReturnType<Highlight>>) {
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
		<>
			<button type="button" class={styles.copyButton} onclick={copyScript}>
				<CopyIcon label="コードをコピー" class={styles.copyIcon} />
				<CheckIcon label="コピーしました" class={styles.copiedIcon} />
			</button>
			{/* ボタンの中のライブ領域は読み上げられないため、隣に置く。 */}
			<span role="status" class={styles.status}>
				<span class={styles.statusText}>コピーしました</span>
			</span>
		</>
	);
}
