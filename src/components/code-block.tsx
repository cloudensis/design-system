import type { JSX } from "hono/jsx";
import { CheckIcon } from "../icons/check.tsx";
import { CopyIcon } from "../icons/copy.tsx";
import { type CodeLanguage, highlight } from "../lib/highlight.ts";
import { cn } from "../lib/utils.ts";
import styles from "./code-block.module.css";

/** スクリーンリーダー向けの文言。ページの言語にあわせて上書きする。 */
export type CodeBlockLabels = {
	/** コピーボタンの名前。 */
	copy: string;
	/** コピーした後のボタンの名前と、読み上げる文言。 */
	copied: string;
};

const defaultLabels: CodeBlockLabels = {
	copy: "コードをコピー",
	copied: "コピーしました",
};

type CodeBlockProps = Omit<JSX.IntrinsicElements["pre"], "children"> & {
	class?: string;
	/** 省略するとハイライトしない。 */
	lang?: CodeLanguage;
	/** 省略した文言は日本語になる。 */
	labels?: Partial<CodeBlockLabels>;
	children: string;
};

export function CodeBlock({
	lang,
	class: className,
	labels,
	children,
	...props
}: CodeBlockProps) {
	/* テンプレートリテラルの前後の空行を落とす。 */
	const code = children.replace(/^[\r\n]+/, "").trimEnd();

	return (
		<pre class={cn("not-prose", styles.codeBlock, className)} {...props}>
			{/* tabindex はキーボードでスクロールするため。 */}
			<code tabindex={0} class={styles.code}>
				{renderCode(code, lang)}
			</code>
			<CopyButton labels={{ ...defaultLabels, ...labels }} />
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

function CopyButton({ labels }: { labels: CodeBlockLabels }) {
	return (
		<>
			{/* @cloudensis/design-system/scripts/code-block が動くまで隠しておく。 */}
			<button
				type="button"
				class={styles.copyButton}
				data-code-block-copy
				hidden
			>
				<CopyIcon label={labels.copy} class={styles.copyIcon} />
				<CheckIcon label={labels.copied} class={styles.copiedIcon} />
			</button>
			{/* ボタンの中のライブ領域は読み上げられないため、隣に置く。 */}
			<span role="status" class={styles.status}>
				<span class={styles.statusText}>{labels.copied}</span>
			</span>
		</>
	);
}
