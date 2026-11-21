/// <reference lib="dom" />
/*
 * CodeBlock のコピーボタンを動かすスクリプト。ブラウザで 1 回読み込む。
 * インラインハンドラーを使わないため、CSP は script-src 'self' のままでよい。
 */

const buttonSelector = "[data-code-block-copy]";
const copiedDuration = 2000;
const timers = new WeakMap<HTMLElement, ReturnType<typeof setTimeout>>();

/** スクリプトが動くまでボタンは隠してあるので、表示する。後から追加したボタンにも呼べる。 */
export function enableCopyButtons(root: ParentNode = document): void {
	for (const button of root.querySelectorAll<HTMLElement>(buttonSelector)) {
		button.hidden = false;
	}
}

async function copy(button: HTMLElement): Promise<void> {
	const code = button.closest("pre")?.querySelector("code");
	if (!code) return;
	const selectAll = () => getSelection()?.selectAllChildren(code);
	if (!navigator.clipboard) return selectAll();
	try {
		await navigator.clipboard.writeText(code.textContent ?? "");
	} catch {
		return selectAll();
	}
	button.dataset.copied = "";
	clearTimeout(timers.get(button));
	timers.set(
		button,
		setTimeout(() => delete button.dataset.copied, copiedDuration),
	);
}

const installed = Symbol.for("@cloudensis/design-system/code-block");
const state = globalThis as typeof globalThis & { [installed]?: boolean };

/* 複数回読み込まれても、リスナーは 1 つだけ登録する。 */
if (!state[installed]) {
	state[installed] = true;
	document.addEventListener("click", (event) => {
		if (!(event.target instanceof Element)) return;
		const button = event.target.closest<HTMLElement>(buttonSelector);
		if (button) void copy(button);
	});
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", () => enableCopyButtons());
	} else {
		enableCopyButtons();
	}
}
