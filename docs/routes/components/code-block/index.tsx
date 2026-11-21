import type { Handler } from "hono";
import { CodeBlock } from "../../../../src/components/code-block.tsx";
import { codeLanguages } from "../../../../src/lib/highlight.ts";
import shared from "../../shared.module.css";

const sampleTsx = `import { CodeBlock } from "@cloudensis/design-system/components/code-block";

export function Example() {
	return <CodeBlock lang="tsx">{code}</CodeBlock>;
}`;

const sampleCss = `@import "@cloudensis/design-system/index.css";`;

const scriptTs = `// ブラウザで動くスクリプト（クライアントのエントリーなど）で 1 回読み込む。
import "@cloudensis/design-system/scripts/code-block";`;

const dynamicTs = `import { enableCopyButtons } from "@cloudensis/design-system/scripts/code-block";

// 読み込んだ後に追加した CodeBlock のボタンを表示する。
enableCopyButtons(container);`;

function Page() {
	return (
		<div class={shared.stack}>
			<CodeBlock lang="tsx">{sampleTsx}</CodeBlock>
			<CodeBlock lang="css">{sampleCss}</CodeBlock>
			<CodeBlock>{"lang を省略するとハイライトしません。"}</CodeBlock>

			<div class="prose">
				<p>
					lang を渡すと Shiki
					でハイライトします。同期的に動くので、サーバー側でもブラウザ側でも使えます。
				</p>
				<p>
					右上のボタンでコードをコピーできます（下記のスクリプトが必要です）。コピーするとアイコンが
					2 秒間チェックマークになります。クリップボード API
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
				<h2>コピーボタンのスクリプト</h2>
				<p>
					コピーボタンは、ブラウザで次のスクリプトを読み込むと動きます。読み込むまでボタンは表示されません。
				</p>
			</div>
			<CodeBlock lang="ts">{scriptTs}</CodeBlock>
			<div class="prose">
				<p>
					スクリプトを読み込んだ後に CodeBlock
					を追加した場合は、enableCopyButtons を呼んでボタンを表示します。
				</p>
			</div>
			<CodeBlock lang="ts">{dynamicTs}</CodeBlock>
			<div class="prose">
				<h2>CSP</h2>
				<p>
					インラインのスクリプトやハンドラーは使っていません。スクリプトを自分のオリジンから配信していれば、script-src
					'self' のままで動きます。
				</p>
			</div>
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
