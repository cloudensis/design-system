import { Fragment, type JSX } from "hono/jsx";
import { type CodeLanguage, highlight } from "../../lib/highlight.ts";
import { cn } from "../../lib/utils.ts";

/* コピーボタンの動作。document へのイベント委譲で 1 度だけ登録するため、ページ内
   の CodeBlock が何個あっても、CSR で後から描画されても動作します。コンポーネント
   に同梱しているので、利用側でスクリプトを設置する必要はありません。 */
const copyScript = `(() => {
const key = "__cloudensisCodeBlockCopy";
if (globalThis[key]) return;
globalThis[key] = true;
document.addEventListener("click", (event) => {
	const button = event.target?.closest?.('[data-slot="code-block-copy"]');
	if (!button || !navigator.clipboard) return;
	const code = button.closest('[data-slot="code-block"]')?.querySelector("code")?.textContent;
	if (code == null) return;
	navigator.clipboard.writeText(code).then(() => {
		// コピー済みの表示を一定時間で戻す。タイマーはボタンごとに持たせる。
		clearTimeout(button[key]);
		button.dataset.copied = "";
		button[key] = setTimeout(() => { delete button.dataset.copied; }, 2000);
	});
});
})();`;

const variants = {
	variant: {
		default: cn(
			"overflow-x-auto rounded border border-border bg-surface p-4 pr-12 text-sm",
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
		<div data-slot="code-block" class="relative">
			<pre
				data-slot="code-block-pre"
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
			<button
				type="button"
				data-slot="code-block-copy"
				aria-label="コードをコピー"
				class="group absolute top-2 right-2 cursor-pointer rounded border border-border bg-surface p-1.5 text-fg-muted transition-colors hover:text-fg"
			>
				<CopyIcon class="group-data-copied:hidden" />
				<CheckIcon class="hidden group-data-copied:block" />
			</button>
			{/* SSR と CSR のどちらのレンダラーでも script の中身として扱えるのは
			    dangerouslySetInnerHTML だけのため、ここではこれを使います。
			    渡しているのは上で定義した定数で、外部からの入力は含みません。 */}
			<script dangerouslySetInnerHTML={{ __html: copyScript }} />
		</div>
	);
}

type IconProps = {
	class?: string;
};

function CopyIcon({ class: className }: IconProps) {
	return (
		<svg
			class={cn("size-4", className)}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<rect x="8" y="8" width="14" height="14" rx="2" />
			<path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
		</svg>
	);
}

function CheckIcon({ class: className }: IconProps) {
	return (
		<svg
			class={cn("size-4", className)}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<path d="M20 6 9 17l-5-5" />
		</svg>
	);
}
