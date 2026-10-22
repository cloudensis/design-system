import { CodeBlock } from "../../src/components/code-block.tsx";

export function Template() {
	return (
		<div class="prose">
			<p>Cloudensis合同会社のデザインシステム</p>

			<h2>Installation</h2>

			<p>`@cloudensis/design-system`, `hono`, `tailwindcss`をインストール</p>
			<CodeBlock lang="sh">
				{"npm install @cloudensis/design-system hono tailwindcss"}
			</CodeBlock>

			<p>cssファイルに`@import`を追加</p>
			<CodeBlock lang="css">
				{[
					'@import "tailwindcss";',
					'@import "@cloudensis/design-system/index.css";',
				].join("\n")}
			</CodeBlock>
			<p>
				※ index.css にはフォント・色・タイポグラフィ・body
				とフォーカス枠の既定のスタイル・記事用スタイルと、コンポーネントのクラスの収集設定が含まれます。
			</p>

			<p>コンポーネントはファイルごとに import</p>
			<CodeBlock lang="tsx">
				{
					'import { Button } from "@cloudensis/design-system/components/button";'
				}
			</CodeBlock>
		</div>
	);
}
