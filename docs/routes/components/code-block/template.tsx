import { CodeBlock } from "../../../../src/components/code-block.tsx";
import { codeLanguages } from "../../../../src/lib/highlight.ts";

const sampleTsx = `import { CodeBlock } from "@cloudensis/design-system/components/code-block";

export function Example() {
	return <CodeBlock lang="tsx">{code}</CodeBlock>;
}`;

const sampleCss = `@import "tailwindcss";
@import "@cloudensis/design-system/index.css";`;

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

export function Template() {
	return (
		<div class="space-y-6">
			<CodeBlock lang="tsx">{sampleTsx}</CodeBlock>
			<CodeBlock lang="css">{sampleCss}</CodeBlock>
			<CodeBlock>{"lang を省略するとハイライトしません。"}</CodeBlock>

			<div class="prose">
				<p>
					lang を渡すと Shiki
					でハイライトします。同期的に動くので、サーバー側でもブラウザ側でも使えます。
				</p>
				<p>
					右上のボタンでコードをコピーできます。コピーするとアイコンが 2
					秒間チェックマークになります。クリップボード API
					が使えない場合は、コード全体を選択します。
				</p>
				<h2>lang に渡せる値</h2>
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
