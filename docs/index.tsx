import { Hono, type MiddlewareHandler } from "hono";
import { secureHeaders } from "hono/secure-headers";
import { Section } from "../src/components/layout/section.tsx";
import { LinkButton } from "../src/components/ui/button.tsx";
import { CodeBlock } from "../src/components/ui/code-block.tsx";
import tokensCss from "../src/styles/tokens.css?raw";
import { componentSections } from "./components.tsx";
import { getCopyHandlerHash } from "./csp.ts";
import { entries } from "./entries.ts";
import { Layout } from "./layout.tsx";
import { sampleCss } from "./samples.ts";
import { site } from "./site.ts";

const tokens = [...tokensCss.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map(
	([, name, value]) => ({ name, value: value.trim().replace(/\s+/g, " ") }),
);

const proseSpacingCss = `/* ブロックの余白は下方向にだけ持たせる */
.prose :where(h1, h2, h3, h4, h5, h6, p, ul, ol, dl, pre, blockquote, figure, table, details, hr) {
	margin-block: 0 1.25em;
}

/* 見出しは続く本文と近づける */
.prose :where(h1, h2, h3, h4, h5, h6) {
	margin-block-end: 0.75em;
}

/* 見出しと hr の手前は、直前のブロックの下余白を広げて距離を取る */
.prose :where(:has(+ :is(h1, h2, h3, h4, h5, h6, hr))) {
	margin-block-end: 2.5em;
}`;

const samplePreCode = `npm install @cloudensis/design-system
npm run dev`;

const sampleSplitImportCss = `@import "tailwindcss";
@import "@cloudensis/design-system/tokens.css";
@import "@cloudensis/design-system/base.css";
@import "@cloudensis/design-system/prose.css";

/* パスはこの CSS ファイルからの相対で指定します。 */
@source "../node_modules/@cloudensis/design-system/dist/components";`;

const sampleProseCss = `@import "tailwindcss";
@import "@cloudensis/design-system/index.css";

.prose {
	max-width: 42rem;
}`;

const proseElements = [
	{ name: "見出し", tags: "h1 / h2 / h3 / h4 / h5 / h6" },
	{ name: "段落・区切り", tags: "p / br / hr" },
	{ name: "リスト", tags: "ul / ol / li" },
	{ name: "定義リスト", tags: "dl / dt / dd" },
	{ name: "引用", tags: "blockquote / q / cite" },
	{ name: "コード", tags: "pre / code / samp / kbd / var" },
	{
		name: "表",
		tags: "table / caption / thead / tbody / tfoot / tr / th / td",
	},
	{
		name: "図版",
		tags: "figure / figcaption / img / picture / video / svg",
	},
	{
		name: "テキストレベル",
		tags: "a / strong / b / em / i / mark / small / del / ins / s / u / sub / sup / abbr / dfn",
	},
	{ name: "開閉", tags: "details / summary" },
];

const app = new Hono();

/* 案内している CSP をこのサイトにも適用する。'unsafe-inline' は style 属性のため。 */
let csp: MiddlewareHandler | undefined;
app.use(async (c, next) => {
	csp ??= secureHeaders({
		contentSecurityPolicy: {
			defaultSrc: ["'self'"],
			scriptSrc: ["'self'", "'unsafe-hashes'", await getCopyHandlerHash()],
			styleSrc: ["'self'", "'unsafe-inline'"],
			imgSrc: ["'self'", "data:", site.assetOrigin],
			fontSrc: ["'self'", "data:"],
			objectSrc: ["'none'"],
			baseUri: ["'none'"],
			formAction: ["'self'"],
			frameAncestors: ["'none'"],
		},
	});
	return csp(c, next);
});

app.get("/", (c) =>
	c.html(
		<Layout
			description="cloudensis のデザインシステムの導入方法と、既定で適用されるスタイル。"
			url={c.req.url}
		>
			<Section title="このデザインシステムについて">
				<p>
					cloudensis の CSS トークン・記事用スタイル・Hono JSX
					コンポーネントです。SSR・CSR・SSG のいずれでも使えます。
				</p>
			</Section>

			<Section title="導入">
				<div class="space-y-3">
					<p>Tailwind CSS v4 と Hono v4 が必要です。</p>
					<CodeBlock lang="sh">
						{"npm install @cloudensis/design-system"}
					</CodeBlock>
					<p>Tailwind CSS v4 のエントリで次の 1 行を読み込みます。</p>
					<CodeBlock lang="css">
						{`@import "tailwindcss";\n@import "@cloudensis/design-system/index.css";`}
					</CodeBlock>
					<p>
						フォント・トークン・記事用スタイルと、コンポーネントのクラスの収集設定（@source）が含まれます。
					</p>
					<CodeBlock lang="tsx">
						{`import { Button } from "@cloudensis/design-system/components/ui/button";`}
					</CodeBlock>
				</div>
			</Section>

			<Section title="既定のスタイル">
				<div class="space-y-3">
					<p>
						body に --color-bg / --color-fg と太さ 300 を、b / strong に太さ 500
						を適用します。
					</p>
					<CodeBlock lang="css">
						{`body {\n\tbackground-color: var(--color-bg);\n\tcolor: var(--color-fg);\n\tfont-weight: var(--font-weight-light);\n}\n\nb,\nstrong {\n\tfont-weight: var(--font-weight-medium);\n}`}
					</CodeBlock>
					<p>
						b / strong を指定するのは、preflight の bolder が 300 に対して 400
						にしかならないためです。
					</p>
					<p>
						キーボード操作時のフォーカス（:focus-visible）には、--color-accent
						の 2px のアウトラインを表示します。
					</p>
					<p>
						いずれも @layer base
						にあり、ユーティリティクラスで上書きできます。配色は @theme
						でトークンを上書きして変えます。
					</p>
					<CodeBlock lang="css">{sampleCss}</CodeBlock>
				</div>
			</Section>

			<Section title="フォント">
				<div class="space-y-3">
					<p>
						欧文は Outfit、和文は Noto Sans JP です。Fontsource
						の可変フォントを同一オリジンから配信し、unicode-range
						で必要な分だけ読み込みます。
					</p>
					<p>フォントは --font-sans で指定しています。</p>
					<CodeBlock lang="css">
						{`--font-sans:\n\t"Outfit Variable", "Noto Sans JP Variable", ui-sans-serif, system-ui,\n\tsans-serif;`}
					</CodeBlock>
					<p>
						フォントを自分で読み込む場合（next/font など）は、index.css
						の代わりに次のように読み込みます。
					</p>
					<CodeBlock lang="css">{sampleSplitImportCss}</CodeBlock>
				</div>
			</Section>

			<Section title="エントリ一覧">
				<div class="space-y-3">
					<p>いずれも @cloudensis/design-system/ に続けて import します。</p>
					<table class="w-full border-collapse text-left text-sm">
						<thead>
							<tr class="border-border border-b">
								<th class="py-2 font-medium">import</th>
								<th class="py-2 font-medium">内容</th>
							</tr>
						</thead>
						<tbody>
							{entries.map((entry) => (
								<tr key={entry.path} class="border-border border-b">
									<td class="py-2 pr-4 font-mono">{entry.path}</td>
									<td class="py-2 text-fg-muted">{entry.content}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</Section>
		</Layout>,
	),
);

app.get("/tokens", (c) =>
	c.html(
		<Layout
			title="トークン"
			description="配色とフォントを定義するデザイントークンの一覧。"
			url={c.req.url}
		>
			<Section title="トークン一覧">
				<p>
					tokens.css の値です。色とフォントは CSS
					変数とユーティリティクラス（bg-accent など）の両方で使えます。
				</p>
				<p>
					色はセマンティックな名前で定義し、Tailwind
					の既定パレットは使いません。
				</p>
				<p>
					角丸は rounded-sm などで --radius-* を参照します（rounded
					は固定値のため使いません）。文字サイズなどは Tailwind の既定値です。
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
								<td class="p-2 font-mono">{token.name}</td>
								<td class="max-w-56 p-2 font-mono text-fg-muted">
									{token.value}
								</td>
								<td class="p-2">
									{token.name.startsWith("--color-") ? (
										<span
											class="inline-block size-6 rounded-sm border border-border align-middle"
											style={`background: var(${token.name})`}
										/>
									) : token.name.startsWith("--radius-") ? (
										<span
											class="inline-block size-6 border border-fg-muted align-middle"
											style={`border-radius: var(${token.name})`}
										/>
									) : (
										<span style={`font-family: var(${token.name})`}>
											Aa あア亜 0123
										</span>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</Section>
			<Section title="ダークモード">
				<div class="space-y-3">
					<p>
						ライトテーマのみです（コードブロックは常にダーク）。ダークモードにするには
						--color-* を上書きします。
					</p>
					<CodeBlock lang="css">
						{`@media (prefers-color-scheme: dark) {\n\t:root {\n\t\t--color-bg: #171717;\n\t\t--color-fg: #d4d4d4;\n\t}\n}`}
					</CodeBlock>
				</div>
			</Section>
		</Layout>,
	),
);

app.get("/components", (c) =>
	c.html(
		<Layout
			title="コンポーネント"
			description="Hono の JSX で実装した UI コンポーネントのカタログ。"
			url={c.req.url}
		>
			{componentSections.map((section) => (
				<Section
					key={section.name}
					id={section.name.toLowerCase()}
					title={section.name}
				>
					{section.body}
				</Section>
			))}
		</Layout>,
	),
);

app.get("/prose", (c) =>
	c.html(
		<Layout
			title="記事スタイル"
			description="記事本文用のクラス .prose が対応している HTML タグと、ブロック間の余白の考え方。"
			url={c.req.url}
		>
			<Section title="prose">
				<div class="space-y-3">
					<p>記事本文を囲む要素に .prose を付けます。</p>
					<CodeBlock lang="tsx">{`<article class="prose">...</article>`}</CodeBlock>
					<p>
						セレクタは :where() で詳細度を 0 にし、@layer components
						に置いているため、ユーティリティクラスで上書きできます。
					</p>
				</div>
			</Section>
			<Section title="ブロック間の余白">
				<div class="space-y-3">
					<p>
						余白は下方向だけに持たせ、margin の相殺に頼りません。flex や grid
						の中でも間隔が変わりません。
					</p>
					<p>
						見出しと hr の手前は、直前のブロックの下余白を :has() で広げます。
					</p>
					<CodeBlock lang="css">{proseSpacingCss}</CodeBlock>
					<p>
						先頭と末尾の余白は打ち消すため、.prose の要素に padding
						を付けても上下だけ広くなりません。
					</p>
				</div>
			</Section>
			<Section title="対応している要素">
				<div class="space-y-3">
					<p>prose.css が対応しているタグです。</p>
					<table class="w-full border-collapse text-left text-sm">
						<thead>
							<tr class="border-border border-b">
								<th class="py-2 font-medium">分類</th>
								<th class="py-2 font-medium">タグ</th>
							</tr>
						</thead>
						<tbody>
							{proseElements.map((group) => (
								<tr key={group.name} class="border-border border-b">
									<td class="whitespace-nowrap py-2">{group.name}</td>
									<td class="py-2 font-mono text-fg-muted">{group.tags}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</Section>
			<Section title="サンプル">
				<p>上の表のタグを並べたサンプルです。</p>
				<article class="prose rounded-sm border border-border p-6">
					<h1>記事スタイルのサンプル</h1>
					<p>
						この記事は <code>.prose</code> が扱う HTML
						タグを一通り並べたものです。本文の中では{" "}
						<strong>strong による強い強調</strong>や<em>em による強調</em>、
						<a href="/tokens">a によるリンク</a>、
						<mark>mark によるハイライト</mark>、<small>small による注記</small>
						、<del>del で消した文</del>、<ins>ins で足した文</ins>、
						<s>s で無効になった文</s>
						をそのまま使えます。
					</p>
					<p>
						略語は <abbr title="Cascading Style Sheets">CSS</abbr>{" "}
						のように書けます。化学式は H<sub>2</sub>O、指数は E = mc
						<sup>2</sup>。 キー操作は <kbd>Ctrl</kbd> + <kbd>C</kbd>{" "}
						のように示します。
						<dfn>prose</dfn> は記事本文に付けるクラスの名前です。
						<br />
						br で改行した行です。
					</p>
					<h2>見出し</h2>
					<p>
						h1 から h6
						まで、サイズと余白が段階的に変わります。見出しは直前のブロックから離れ、
						続く本文とは近づきます。
					</p>
					<h3>h3 の見出し</h3>
					<p>h3 に続く本文です。</p>
					<h4>h4 の見出し</h4>
					<p>h4 に続く本文です。</p>
					<h5>h5 の見出し</h5>
					<p>h5 に続く本文です。</p>
					<h6>h6 の見出し</h6>
					<p>h6 に続く本文です。</p>
					<h2>リスト</h2>
					<ul>
						<li>ul の項目です。</li>
						<li>
							入れ子にするとマーカーが disc → circle → square と変わります。
							<ul>
								<li>
									2 階層目の項目
									<ul>
										<li>3 階層目の項目</li>
									</ul>
								</li>
							</ul>
						</li>
						<li>項目の中には段落やコードも置けます。</li>
					</ul>
					<ol>
						<li>ol の項目です。</li>
						<li>
							入れ子にすると decimal → lower-alpha → lower-roman と変わります。
							<ol>
								<li>
									2 階層目の項目
									<ol>
										<li>3 階層目の項目</li>
									</ol>
								</li>
							</ol>
						</li>
						<li>3 つ目の項目</li>
					</ol>
					<h3>定義リスト</h3>
					<dl>
						<dt>トークン</dt>
						<dd>
							配色やタイポグラフィの値に名前を付けたものです。tokens.css の
							@theme で定義しています。
						</dd>
						<dt>prose</dt>
						<dd>記事本文に付けるクラスの名前です。</dd>
					</dl>
					<h2>引用</h2>
					<blockquote>
						<p>
							よいデザインは、できるだけ少ないデザインで成り立っている。
							本質的でないものをすべて取り除けば、本質が際立つ。
						</p>
						<p>
							— <cite>Dieter Rams</cite>
						</p>
					</blockquote>
					<p>
						文中の短い引用は <q>このように</q> 書きます。
					</p>
					<h2>コード</h2>
					<p>
						インラインのコードは <code>--color-fg</code> のように表示されます。
						コマンドの出力は <samp>done</samp> のように示します。
					</p>
					<p>
						pre と code を直に書いた場合は、ハイライトなしのコードブロックです。
					</p>
					<pre>
						<code>{samplePreCode}</code>
					</pre>
					<p>
						CodeBlock コンポーネントを使うと、同じ見た目のままハイライトと
						コピーボタンが付きます。
					</p>
					<CodeBlock lang="css">{sampleProseCss}</CodeBlock>
					<h2>表</h2>
					<table>
						<caption>エントリごとの内容</caption>
						<thead>
							<tr>
								<th>import</th>
								<th>内容</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>tokens.css</td>
								<td>@theme によるトークン定義</td>
							</tr>
							<tr>
								<td>base.css</td>
								<td>body の既定のスタイル</td>
							</tr>
							<tr>
								<td>prose.css</td>
								<td>記事本文用のスタイル</td>
							</tr>
						</tbody>
						<tfoot>
							<tr>
								<td>index.css</td>
								<td>上記をまとめたエントリ</td>
							</tr>
						</tfoot>
					</table>
					<h2>図版</h2>
					<figure>
						<img
							src={site.logo}
							alt="cloudensis のロゴ"
							width="120"
							height="120"
						/>
						<figcaption>
							figure と figcaption。画像は max-width: 100% で枠に収まります。
						</figcaption>
					</figure>
					<h2>開閉</h2>
					<details>
						<summary>details と summary</summary>
						<p>
							開いたときだけ表示される本文です。中のブロックにも同じ余白が
							適用されます。
						</p>
					</details>
					<hr />
					<p>
						hr
						の下の段落です。区切り線の手前も、見出しと同じだけ余白を広げています。
					</p>
				</article>
			</Section>
		</Layout>,
	),
);

app.notFound((c) =>
	c.html(
		<Layout
			title="ページが見つかりません"
			description="お探しのページは見つかりませんでした。"
			url={c.req.url}
		>
			<div class="space-y-3">
				<p>
					お探しのページは移動または削除されたか、URL
					が間違っている可能性があります。
				</p>
				<LinkButton href="/">概要に戻る</LinkButton>
			</div>
		</Layout>,
		404,
	),
);

export default app;
