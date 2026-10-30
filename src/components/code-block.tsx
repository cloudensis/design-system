import type { JSX } from "hono/jsx";
import { CheckIcon } from "../icons/check.tsx";
import { CopyIcon } from "../icons/copy.tsx";
import { type CodeLanguage, highlight } from "../lib/highlight.ts";
import { cn } from "../lib/utils.ts";
import styles from "./code-block.module.css";

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
		<pre class={cn("not-prose", styles.codeBlock, className)} {...props}>
			{/* tabindex はキーボードでスクロールするため。 */}
			<code tabindex={0} class={styles.code}>
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
