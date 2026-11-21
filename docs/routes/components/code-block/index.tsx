import type { Handler } from "hono";
import { codeLanguages } from "../../../../src/lib/bundled-highlight.ts";
import { CodeBlock } from "../../../code-block.tsx";
import shared from "../../shared.module.css";

const sampleTsx = `import { CodeBlock } from "@cloudensis/design-system/components/code-block";

// ハイライトしない。Shiki を同梱しないので軽い。
<CodeBlock>{code}</CodeBlock>`;

const createTsx = `// app/components/code-block.tsx（アプリで 1 回だけ作る）
import { createCodeBlock } from "@cloudensis/design-system/components/code-block";
import { createHighlight } from "@cloudensis/design-system/lib/highlight";
import css from "@shikijs/langs/css";
import tsx from "@shikijs/langs/tsx";

export const CodeBlock = createCodeBlock(
	createHighlight<"tsx" | "ts" | "css">({ langs: [tsx, css], langAlias: { ts: "tsx" } }),
);

// 使う側
<CodeBlock lang="tsx">{code}</CodeBlock>`;

const allTsx = `import { createCodeBlock } from "@cloudensis/design-system/components/code-block";
import { highlight } from "@cloudensis/design-system/lib/bundled-highlight";

export const CodeBlock = createCodeBlock(highlight);`;

const sampleCss = `@import "@cloudensis/design-system/index.css";`;

/* インラインハンドラーの CSP 用ハッシュを、描画結果から計算する。 */
async function CopyHandlerHash() {
	const handler = String(CodeBlock({ children: "" }))
		.match(/onclick="([^"]*)"/)?.[1]
		?.replaceAll("&#39;", "'")
		.replaceAll("&quot;", '"')
		.replaceAll("&gt;", ">")
		.replaceAll("&lt;", "<")
		.replaceAll("&amp;", "&");
	if (!handler) throw new Error("CodeBlock のコピーハンドラーが見つかりません");
	const digest = await crypto.subtle.digest(
		"SHA-256",
		new TextEncoder().encode(handler),
	);
	const hash = btoa(String.fromCharCode(...new Uint8Array(digest)));
	return (
		<CodeBlock>{`Content-Security-Policy: script-src 'self' 'unsafe-hashes' 'sha256-${hash}'`}</CodeBlock>
	);
}

function Page() {
	return (
		<div class={shared.stack}>
			<CodeBlock lang="tsx">{sampleTsx}</CodeBlock>
			<CodeBlock lang="css">{sampleCss}</CodeBlock>
			<CodeBlock>{"lang を省略するとハイライトしません。"}</CodeBlock>

			<div class="prose">
				<p>
					CodeBlock はそのままではハイライトしません。Shiki
					の文法は大きく、同梱するとバンドルが数百 KB
					増えるため、ハイライトは使う言語を選んで組み込みます。
				</p>
				<h2>ハイライト</h2>
				<p>
					createHighlight に @shikijs/langs
					の文法を渡してハイライト関数を作り、createCodeBlock で CodeBlock
					に束ねます。lang
					を渡すとハイライトします。同期的に動くので、サーバー側でもブラウザ側でも使えます。
				</p>
			</div>
			<CodeBlock lang="tsx">{createTsx}</CodeBlock>
			<div class="prose">
				<p>
					手軽に始めるときは、よく使う言語をまとめた lib/bundled-highlight の
					highlight を使えます。ただし import するだけで約 700KB（minify
					後）増えます。このサイトはこれを使っています。
				</p>
			</div>
			<CodeBlock lang="tsx">{allTsx}</CodeBlock>
			<div class="prose">
				<h2>コピー</h2>
				<p>
					右上のボタンでコードをコピーできます。コピーするとアイコンが 2
					秒間チェックマークになります。クリップボード API
					が使えない場合は、コード全体を選択します。
				</p>
				<h2>highlight の lang に渡せる値</h2>
				<table>
					<thead>
						<tr>
							<th>値</th>
							<th>文法</th>
						</tr>
					</thead>
					<tbody>
						{Object.entries(codeLanguages).map(([grammar, values]) => (
							<tr key={grammar}>
								<td>
									<code>{values.join(" / ")}</code>
								</td>
								<td>{grammar}</td>
							</tr>
						))}
					</tbody>
				</table>
				<h2>CSP</h2>
				<p>
					コピーボタンはインラインハンドラーで動きます。CSP で script-src
					を制限している場合は、'unsafe-hashes'
					と次のハッシュを追加してください。
				</p>
			</div>
			<CopyHandlerHash />
		</div>
	);
}

const ssg = true;

const GET: Handler = (c) =>
	c.render(<Page />, {
		title: "CodeBlock",
		description: "CodeBlock コンポーネント",
	});

export { GET, ssg };
