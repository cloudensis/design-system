import { CodeBlock } from "../src/components/ui/code-block.tsx";

const htmlEntities: Record<string, string> = {
	"&amp;": "&",
	"&lt;": "<",
	"&gt;": ">",
	"&quot;": '"',
	"&#39;": "'",
};

let hash: Promise<string> | undefined;

/**
 * CodeBlock のコピーボタンのインラインハンドラーから、CSP に指定するハッシュ
 * （'sha256-...'）を計算します。実際に描画した onclick 属性から求めるため、
 * ハンドラーを変えても値を書き換える必要はありません。
 */
export const getCopyHandlerHash = (): Promise<string> =>
	(hash ??= (async () => {
		const markup = String(CodeBlock({ children: "" }));
		const handler = markup
			.match(/onclick="([^"]*)"/)?.[1]
			?.replace(/&(amp|lt|gt|quot|#39);/g, (entity) => htmlEntities[entity]);
		if (!handler)
			throw new Error("CodeBlock のコピーハンドラーが見つかりません");
		const digest = await crypto.subtle.digest(
			"SHA-256",
			new TextEncoder().encode(handler),
		);
		return `'sha256-${btoa(String.fromCharCode(...new Uint8Array(digest)))}'`;
	})());
