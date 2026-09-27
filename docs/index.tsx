import { Hono } from "hono";
import { raw } from "hono/html";
import { LogoLockup } from "../src/brand/logo-lockup.tsx";
import { LogoMark } from "../src/brand/logo-mark.tsx";
import { LogoType } from "../src/brand/logo-type.tsx";
import { Button } from "../src/components/button.tsx";
import colorsCss from "../src/styles/colors.css?raw";
import typographyCss from "../src/styles/typography.css?raw";
import styleUrl from "./style.css?url";

const colors = [...colorsCss.matchAll(/--([\w-]+):\s*([^;]+);/g)].map(
	([, name, value]) => ({ name, value: value.trim() }),
);

/* --text-heading-1--line-height などの修飾子を、親の名前ごとにまとめる。 */
const typography = [
	...typographyCss.matchAll(/--text-([\w-]+?):\s*([^;]+);/g),
].reduce<Record<string, Record<string, string>>>(
	(styles, [, name, value]) => {
		const [base, property = "font-size"] = name.split("--");
		styles[base] = { ...styles[base], [property]: value.trim() };
		return styles;
	},
	{},
);

const fonts = [...typographyCss.matchAll(/^\s*--font-([\w-]+):\s*([^;]+);/gm)].map(
	([, name, value]) => ({ name, value: value.trim().replace(/\s+/g, " ") }),
);

const samplePreCode = `npm install @cloudensis/design-system
npm run dev`;

const app = new Hono();

app.get("/", (c) => {
	const ogImageUrl = new URL("/ogp.png", c.req.url).toString();
	return c.html(
		<>
			{raw("<!doctype html>")}
			<html lang="ja">
				<head>
					<meta charset="utf-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<title>cloudensis design system</title>
					<meta property="og:type" content="website" />
					<meta property="og:title" content="cloudensis design system" />
					<meta property="og:image" content={ogImageUrl} />
					<meta property="og:image:width" content="1200" />
					<meta property="og:image:height" content="630" />
					<meta name="twitter:card" content="summary_large_image" />
					<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
					<link rel="apple-touch-icon" href="/logo.png" />
					<link rel="stylesheet" href={styleUrl} />
				</head>
				<body>
					<main class="mx-auto max-w-3xl space-y-12 px-6 py-12">
						<h1 class="text-heading-1">cloudensis design system</h1>

						<section class="space-y-4">
							<h2 class="text-heading-2">Colors</h2>
							<table class="w-full text-left text-sm">
								<thead>
									<tr>
										<th class="py-2 font-medium">名前</th>
										<th class="py-2 font-medium">値</th>
										<th class="py-2 font-medium">見本</th>
									</tr>
								</thead>
								<tbody>
									{colors.map(({ name, value }) => (
										<tr key={name}>
											<td class="py-2 font-mono">--{name}</td>
											<td class="py-2 font-mono">{value}</td>
											<td class="py-2">
												<span
													class="inline-block size-6 rounded-sm border align-middle"
													style={`background-color: ${value}`}
												/>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</section>

						<section class="space-y-4">
							<h2 class="text-heading-2">Typography</h2>
							<table class="w-full text-left text-sm">
								<thead>
									<tr>
										<th class="py-2 font-medium">クラス</th>
										<th class="py-2 font-medium">値</th>
										<th class="py-2 font-medium">見本</th>
									</tr>
								</thead>
								<tbody>
									{fonts.map(({ name, value }) => (
										<tr key={name}>
											<td class="whitespace-nowrap py-2 pr-4 font-mono">font-{name}</td>
											<td class="py-2 font-mono">{value}</td>
											<td class="py-2 text-lg" style={`font-family: ${value}`}>
												Aa あア亜 0123
											</td>
										</tr>
									))}
								</tbody>
							</table>
							<table class="w-full text-left text-sm">
								<thead>
									<tr>
										<th class="py-2 font-medium">クラス</th>
										<th class="py-2 font-medium">値</th>
										<th class="py-2 font-medium">見本</th>
									</tr>
								</thead>
								<tbody>
									{Object.entries(typography).map(([name, style]) => (
										<tr key={name}>
											<td class="py-2 font-mono">text-{name}</td>
											<td class="py-2 font-mono">
												{Object.entries(style).map(([property, value]) => (
													<div key={property}>
														{property}: {value}
													</div>
												))}
											</td>
											<td
												class="py-2"
												style={Object.entries(style)
													.map(([property, value]) => `${property}: ${value}`)
													.join("; ")}
											>
												見出し Heading
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</section>

						<section class="space-y-4">
							<h2 class="text-heading-2">Brand</h2>
							<table class="w-full text-left text-sm">
								<thead>
									<tr>
										<th class="py-2 font-medium">コンポーネント</th>
										<th class="py-2 font-medium">見本</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td class="py-2 font-mono">LogoMark</td>
										<td class="py-2">
											<LogoMark label="cloudensis" />
										</td>
									</tr>
									<tr>
										<td class="py-2 font-mono">LogoType</td>
										<td class="py-2 text-xl">
											<LogoType />
										</td>
									</tr>
									<tr>
										<td class="py-2 font-mono">LogoLockup</td>
										<td class="space-y-2 py-2">
											<div>
												<LogoLockup />
											</div>
											<div>
												<LogoLockup class="text-3xl" />
											</div>
										</td>
									</tr>
								</tbody>
							</table>
						</section>

						<section id="prose" class="space-y-4">
							<h2 class="text-heading-2">Prose</h2>
							<p>記事本文を囲む要素に .prose を付けます。</p>
							<article class="prose rounded-sm border border-default p-6">
								<h1>記事スタイルのサンプル</h1>
								<p>
									この記事は <code>.prose</code> が扱う HTML
									タグを一通り並べたものです。本文の中では{" "}
									<strong>strong による強い強調</strong>や<em>em による強調</em>、
									<a href="#prose">a によるリンク</a>、
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
										配色やタイポグラフィの値に名前を付けたものです。colors.css と
										typography.css の @theme で定義しています。
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
									インラインのコードは <code>--text-color-default</code> のように表示されます。
									コマンドの出力は <samp>done</samp> のように示します。
								</p>
								<p>
									pre と code を直に書いた場合は、ハイライトなしのコードブロックです。
								</p>
								<pre>
									<code>{samplePreCode}</code>
								</pre>
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
											<td>colors.css</td>
											<td>色のトークン</td>
										</tr>
										<tr>
											<td>typography.css</td>
											<td>書体と見出しのトークン</td>
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
											<td>計</td>
											<td>4 ファイル</td>
										</tr>
									</tfoot>
								</table>
								<h2>図版</h2>
								<figure>
									<img
										src="/logo.png"
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
						</section>

						<section class="space-y-4">
							<h2 class="text-heading-2">Button</h2>
							<div class="flex flex-wrap gap-4">
								<Button>ボタン</Button>
								<Button disabled>disabled</Button>
							</div>
						</section>
					</main>
				</body>
			</html>
		</>,
	);
});

export default app;
