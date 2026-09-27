import { CodeBlock } from "../../src/components/code-block.tsx";

const installCss = `@import "tailwindcss";
@import "@cloudensis/design-system/index.css";`;

const importTsx = `import { Button } from "@cloudensis/design-system/components/button";`;

export function Template() {
	return (
		<div class="prose">
			<p>
				cloudensis の CSS トークン・記事用スタイル・Hono JSX
				コンポーネントです。
			</p>
			<h2>導入</h2>
			<p>Tailwind CSS v4 と Hono v4 が必要です。</p>
			<CodeBlock lang="sh">npm install @cloudensis/design-system</CodeBlock>
			<p>Tailwind CSS のエントリで index.css を読み込みます。</p>
			<CodeBlock lang="css">{installCss}</CodeBlock>
			<p>
				index.css にはフォント・色・タイポグラフィ・body
				の既定のスタイル・記事用スタイルと、コンポーネントのクラスの収集設定が含まれます。
			</p>
			<p>コンポーネントはファイルごとに import します。</p>
			<CodeBlock lang="tsx">{importTsx}</CodeBlock>
		</div>
	);
}
