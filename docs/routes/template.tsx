import { CodeBlock } from "../../src/components/code-block.tsx";

const installCss = `@import "@cloudensis/design-system/index.css";`;

const importTsx = `import { Button } from "@cloudensis/design-system/components/button";`;

export function Template() {
	return (
		<div class="prose">
			<p>
				cloudensis の CSS トークン・記事用スタイル・Hono JSX
				コンポーネントです。
			</p>
			<h2>導入</h2>
			<p>Hono v4 が必要です。</p>
			<CodeBlock lang="sh">npm install @cloudensis/design-system</CodeBlock>
			<p>CSS で index.css を読み込みます。</p>
			<CodeBlock lang="css">{installCss}</CodeBlock>
			<p>
				index.css
				にはフォント・色・タイポグラフィ・角丸のトークン、リセット、body
				とフォーカス枠の既定のスタイル、記事用スタイルと、コンポーネントのスタイルが含まれます。
			</p>
			<p>
				コンポーネントのスタイルは CSS Modules で書かれ、@layer components
				に入っています。レイヤーの外に書いたスタイルはレイヤーの中より優先されるため、class
				で渡したスタイルでコンポーネントの見た目を上書きできます。
			</p>
			<p>コンポーネントはファイルごとに import します。</p>
			<CodeBlock lang="tsx">{importTsx}</CodeBlock>
		</div>
	);
}
