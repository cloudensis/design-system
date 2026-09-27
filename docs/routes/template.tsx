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
			<pre>
				<code>npm install @cloudensis/design-system</code>
			</pre>
			<p>Tailwind CSS のエントリで index.css を読み込みます。</p>
			<pre>
				<code>{installCss}</code>
			</pre>
			<p>
				index.css にはフォント・色・タイポグラフィ・body
				の既定のスタイル・記事用スタイルと、コンポーネントのクラスの収集設定が含まれます。
			</p>
			<p>コンポーネントはファイルごとに import します。</p>
			<pre>
				<code>{importTsx}</code>
			</pre>
		</div>
	);
}
