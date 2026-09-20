import { Hono } from "hono";
import { Button, LinkButton } from "#/src/components/ui/button";
import tokensCss from "#/src/styles/tokens.css?raw";
import { Code, Layout, Section } from "./layout.tsx";

const tokens = [...tokensCss.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map(
	([, name, value]) => ({ name, value: value.trim() }),
);

const app = new Hono();

app.get("/", (c) =>
	c.html(
		<Layout title="概要">
			<Section title="このデザインシステムについて">
				<p>
					cloudensis で利用する CSS
					トークン・記事用スタイル・コンポーネントを提供します。
					コンポーネントは Hono の JSX で実装されており、SSR・CSR・SSG
					のいずれからも利用できます。
				</p>
			</Section>
			<Section title="導入">
				<Code>{"npm install @cloudensis/design-system"}</Code>
				<p>Tailwind CSS v4 のエントリで次の 1 行を読み込みます。</p>
				<Code>
					{`@import "tailwindcss";\n@import "@cloudensis/design-system/index.css";`}
				</Code>
				<p>
					トークンと記事用スタイルの定義に加えて、コンポーネントが使用している
					クラスの収集設定もこのファイルに含まれているため、利用側での @source
					の指定は不要です。
				</p>
				<Code>
					{`import { Button } from "@cloudensis/design-system/components/ui/button";`}
				</Code>
			</Section>
		</Layout>,
	),
);

app.get("/tokens", (c) =>
	c.html(
		<Layout title="トークン">
			<Section title="トークン一覧">
				<p>
					tokens.css の @theme で定義している値です。CSS 変数としても、 Tailwind
					のユーティリティクラスとしても利用できます。
				</p>
				<table class="w-full border-collapse text-left text-sm">
					<thead>
						<tr class="border-border border-b">
							<th class="py-2 font-medium">名前</th>
							<th class="py-2 font-medium">値</th>
							<th class="py-2 font-medium">見本</th>
						</tr>
					</thead>
					<tbody>
						{tokens.map((token) => (
							<tr key={token.name} class="border-border border-b">
								<td class="py-2 font-mono">{token.name}</td>
								<td class="py-2 font-mono text-fg-muted">{token.value}</td>
								<td class="py-2">
									<span
										class="inline-block size-6 rounded border border-border align-middle"
										style={`background: var(${token.name})`}
									/>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</Section>
		</Layout>,
	),
);

app.get("/components", (c) =>
	c.html(
		<Layout title="コンポーネント">
			<Section title="Button">
				<div class="flex flex-wrap items-center gap-4 rounded border border-border p-6">
					<Button>ボタン</Button>
					<Button disabled>disabled</Button>
				</div>
				<Code>{`<Button>ボタン</Button>`}</Code>
			</Section>
			<Section title="LinkButton">
				<p>見た目は Button と同じまま、a 要素としてレンダリングします。</p>
				<div class="flex flex-wrap items-center gap-4 rounded border border-border p-6">
					<LinkButton href="/">リンクボタン</LinkButton>
				</div>
				<Code>{`<LinkButton href="/">リンクボタン</LinkButton>`}</Code>
			</Section>
		</Layout>,
	),
);

app.get("/prose", (c) =>
	c.html(
		<Layout title="記事スタイル">
			<Section title="prose">
				<p>
					記事本文を囲む要素に .prose
					を付与すると、本文向けのスタイルが適用されます。
				</p>
				<Code>{`<article class="prose">...</article>`}</Code>
				<article class="prose rounded border border-border p-6">
					<h2>見出し</h2>
					<p>
						本文のサンプルです。行間や余白は prose.css で定義しており、
						トークンを参照しているため配色の変更が本文にも反映されます。
					</p>
					<p>
						<a href="/tokens">リンクの見た目</a>もここで確認できます。
					</p>
				</article>
			</Section>
		</Layout>,
	),
);

export default app;
