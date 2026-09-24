import { Hono } from "hono";
import { secureHeaders } from "hono/secure-headers";
import { Footer } from "../src/components/layout/footer.tsx";
import { Header } from "../src/components/layout/header.tsx";
import { Section } from "../src/components/layout/section.tsx";
import { Button, LinkButton } from "../src/components/ui/button.tsx";
import { CodeBlock } from "../src/components/ui/code-block.tsx";
import { DescriptionList } from "../src/components/ui/description-list.tsx";
import { Input } from "../src/components/ui/input.tsx";
import { Select } from "../src/components/ui/select.tsx";
import { Textarea } from "../src/components/ui/textarea.tsx";
import { Tooltip } from "../src/components/ui/tooltip.tsx";
import tokensCss from "../src/styles/tokens.css?raw";
import { Layout } from "./layout.tsx";

const tokens = [...tokensCss.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map(
	([, name, value]) => ({ name, value: value.trim().replace(/\s+/g, " ") }),
);

const sampleTsx = `import { Button } from "@cloudensis/design-system/components/ui/button";

export function ContactForm() {
	return (
		<form method="post" action="/contact">
			<Button type="submit">送信する</Button>
		</form>
	);
}`;

const sampleCss = `@import "tailwindcss";
@import "@cloudensis/design-system/index.css";

@theme {
	--color-bg: #ffffff;
	--color-fg: #171717;
}`;

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

/* CodeBlock の lang に渡せる値。lib/highlight の CodeLanguage と対応させています。 */
const codeLanguages = [
	{ values: "css", grammar: "CSS" },
	{ values: "html", grammar: "HTML" },
	{ values: "javascript / js", grammar: "JavaScript" },
	{ values: "json / jsonc", grammar: "JSON" },
	{ values: "markdown / md", grammar: "Markdown" },
	{ values: "shellscript / sh / bash / shell / zsh", grammar: "Shell" },
	{ values: "tsx / ts / typescript / jsx", grammar: "TypeScript / TSX" },
	{ values: "yaml / yml", grammar: "YAML" },
];

/* prose.css がスタイルを当てている HTML タグ。サンプルの並び順と対応させています。 */
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

/* パッケージが公開しているエントリ。package.json の exports と対応させています。 */
const entries = [
	{
		path: "index.css",
		content: "下記の CSS をまとめたエントリ（通常はこれを読み込む）",
	},
	{ path: "fonts.css", content: "Outfit / Noto Sans JP の @font-face 定義" },
	{ path: "tokens.css", content: "@theme によるトークン定義" },
	{ path: "base.css", content: "body の既定のスタイル（配色・文字の太さ）" },
	{ path: "prose.css", content: "記事本文用のスタイル" },
	{ path: "components/ui/button", content: "Button / LinkButton" },
	{ path: "components/ui/code-block", content: "CodeBlock" },
	{
		path: "components/ui/input",
		content: "Input（type に応じてチェックボックス・ラジオにも対応）",
	},
	{ path: "components/ui/select", content: "Select" },
	{ path: "components/ui/textarea", content: "Textarea" },
	{ path: "components/ui/tooltip", content: "Tooltip" },
	{ path: "components/ui/description-list", content: "DescriptionList" },
	{ path: "components/layout/section", content: "Section" },
	{ path: "components/layout/header", content: "Header" },
	{ path: "components/layout/footer", content: "Footer" },
	{ path: "components/icon/check", content: "CheckIcon" },
	{ path: "components/icon/copy", content: "CopyIcon" },
	{ path: "components/icon/logo", content: "LogoIcon" },
	{
		path: "lib/highlight",
		content: "highlight（CodeBlock が使っている Shiki のハイライター）",
	},
	{ path: "lib/utils", content: "cn" },
];

/* CodeBlock のコピーボタンが使うインラインハンドラーのハッシュ。このサイトの CSP と、
   /components で案内している CSP の両方にこの値を使います。ハンドラーを変えて
   ハッシュが変わると、ここの値が古いままではこのサイトのコピーボタンが動かなく
   なるため、案内している値の更新漏れにも気づけます。 */
const copyHandlerHash = "'sha256-wF1VEFzEsSuwjFla0DgdENA2ZrpzLrVe/rbZm+MK5ME='";

const app = new Hono();

/* /components で案内している CSP をこのサイト自身にも適用します。
   style-src の 'unsafe-inline' は、Shiki のトークンやトークン一覧の見本が
   style 属性を使うために必要です。 */
app.use(
	secureHeaders({
		contentSecurityPolicy: {
			defaultSrc: ["'self'"],
			scriptSrc: ["'self'", "'unsafe-hashes'", copyHandlerHash],
			styleSrc: ["'self'", "'unsafe-inline'"],
			imgSrc: ["'self'", "data:"],
			fontSrc: ["'self'", "data:"],
			objectSrc: ["'none'"],
			baseUri: ["'none'"],
			formAction: ["'self'"],
			frameAncestors: ["'none'"],
		},
	}),
);

app.get("/", (c) =>
	c.html(
		<Layout
			description="cloudensis のデザインシステムの導入方法と、既定で適用されるスタイル。"
			url={c.req.url}
		>
			<Section title="このデザインシステムについて">
				<p>
					cloudensis で利用する CSS
					トークン・記事用スタイル・コンポーネントを提供します。
					コンポーネントは Hono の JSX で実装されており、SSR・CSR・SSG
					のいずれからも利用できます。
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
						フォント（Outfit / Noto Sans
						JP）とトークン、記事用スタイルの定義に加えて、コンポーネントが使用している
						クラスの収集設定もこのファイルに含まれているため、利用側での @source
						の指定は不要です。
					</p>
					<CodeBlock lang="tsx">
						{`import { Button } from "@cloudensis/design-system/components/ui/button";`}
					</CodeBlock>
				</div>
			</Section>

			<Section title="既定のスタイル">
				<div class="space-y-3">
					<p>
						body には --color-bg / --color-fg
						とライト（300）の文字の太さが既定で適用されます。b / strong は
						ミディアム（500）です。 利用側で bg-* や text-*、font-*
						のユーティリティクラスを指定すればいつでも上書きできます。
					</p>
					<CodeBlock lang="css">
						{`body {\n\tbackground-color: var(--color-bg);\n\tcolor: var(--color-fg);\n\tfont-weight: var(--font-weight-light);\n}\n\nb,\nstrong {\n\tfont-weight: var(--font-weight-medium);\n}`}
					</CodeBlock>
					<p>
						b / strong を明示しているのは、Tailwind の preflight が指定する
						font-weight: bolder が、継承値 300 に対して 400
						にしか解決されず本文と区別がつかないためです。
					</p>
					<p>
						@layer base
						で定義しているため、ユーティリティクラスを指定すればいつでも上書きできます。配色をまとめて変えたい場合は、利用側の
						@theme でトークンを上書きしてください。
					</p>
					<CodeBlock lang="css">{sampleCss}</CodeBlock>
				</div>
			</Section>

			<Section title="フォント">
				<div class="space-y-3">
					<p>
						欧文に Outfit、和文に Noto Sans JP を使用します。webfont は
						Fontsource の可変フォントを依存に含めており、index.css
						を読み込むだけで同一オリジンから配信されます（外部 CDN
						への接続は発生しません）。woff2 は unicode-range
						で分割されているため、ブラウザは表示に必要なスライスだけを取得します。
					</p>
					<p>
						フォントの指定は --font-sans トークン 1
						つにまとまっています。Tailwind CSS v4 は既定のフォントとして
						--font-sans を参照するため、この定義だけで反映されます。欧文・数字は
						Outfit で描画され、Outfit が字形を持たない和文は Noto Sans JP
						に落ちます。
					</p>
					<CodeBlock lang="css">
						{`--font-sans:\n\t"Outfit Variable", "Noto Sans JP Variable", ui-sans-serif, system-ui,\n\tsans-serif;`}
					</CodeBlock>
					<p>
						webfont を利用側で読み込みたい場合（next/font
						を使う、フォントを差し替えるなど）は、index.css の代わりに
						tokens.css・base.css・prose.css を個別に読み込み、@source
						を自分で指定してください。
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
					tokens.css で定義している値です。色とフォントは @theme
					で定義しているため、CSS 変数としても、Tailwind
					のユーティリティクラス（bg-accent、text-fg-muted
					など）としても利用できます。
				</p>
				<p>
					色はセマンティックな名前で定義しています。値はこのパッケージが所有しており、Tailwind
					の既定パレットは参照していません。コンポーネントも neutral-*
					のような生のパレットは使わず、このトークン経由で配色しています。
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
											class="inline-block size-6 rounded border border-border align-middle"
											style={`background: var(${token.name})`}
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
						配色はライトテーマのみで、prefers-color-scheme
						によるダークモードの切り替えは行いません（コードブロックだけは常にダークで表示します）。ダークモードに対応したい場合は、利用側で
						--color-* トークンを上書きしてください。
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
			<Section id="button" title="Button">
				<div class="space-y-3">
					<div class="flex flex-wrap items-center gap-4 rounded border border-border p-6">
						<Button>ボタン</Button>
						<Button disabled>disabled</Button>
					</div>
					<CodeBlock lang="tsx">{`<Button>ボタン</Button>`}</CodeBlock>
				</div>
			</Section>
			<Section id="linkbutton" title="LinkButton">
				<div class="space-y-3">
					<p>見た目は Button と同じまま、a 要素としてレンダリングします。</p>
					<div class="flex flex-wrap items-center gap-4 rounded border border-border p-6">
						<LinkButton href="/">リンクボタン</LinkButton>
					</div>
					<CodeBlock lang="tsx">{`<LinkButton href="/">リンクボタン</LinkButton>`}</CodeBlock>
				</div>
			</Section>
			<Section id="input" title="Input">
				<div class="space-y-3">
					<p>
						type に checkbox / radio
						を渡すと、それぞれに合わせたスタイルでレンダリングします。
					</p>
					<div class="flex flex-col gap-4 rounded border border-border p-6">
						<Input type="text" placeholder="テキスト" />
						<Input type="email" placeholder="メールアドレス" />
						<div class="flex items-center gap-2">
							<Input id="sample-checkbox" type="checkbox" />
							<label htmlFor="sample-checkbox">チェックボックス</label>
						</div>
						<div class="flex items-center gap-2">
							<Input id="sample-radio" type="radio" name="sample" />
							<label htmlFor="sample-radio">ラジオボタン</label>
						</div>
					</div>
					<CodeBlock lang="tsx">
						{`<Input type="text" placeholder="テキスト" />\n<Input type="checkbox" />\n<Input type="radio" name="sample" />`}
					</CodeBlock>
				</div>
			</Section>
			<Section id="select" title="Select">
				<div class="space-y-3">
					<div class="rounded border border-border p-6">
						<Select>
							<option value="">選択してください</option>
							<option value="a">選択肢 A</option>
							<option value="b">選択肢 B</option>
						</Select>
					</div>
					<CodeBlock lang="tsx">
						{`<Select>\n\t<option value="">選択してください</option>\n</Select>`}
					</CodeBlock>
				</div>
			</Section>
			<Section id="textarea" title="Textarea">
				<div class="space-y-3">
					<div class="rounded border border-border p-6">
						<Textarea rows={4} placeholder="お問い合わせ内容" />
					</div>
					<CodeBlock lang="tsx">{`<Textarea rows={4} placeholder="お問い合わせ内容" />`}</CodeBlock>
				</div>
			</Section>
			<Section id="tooltip" title="Tooltip">
				<div class="space-y-3">
					<p>
						ホバー（とフォーカス）で補足を表示します。開閉は CSS
						だけで行うため、クライアント JavaScript を読み込まずに動作します。
						ラベルは pointer-events-none
						なので、表示中でもクリックやホバーを遮りません。
					</p>
					<p>
						キーボードから表示するには、中の要素がフォーカスを受け取れる必要があります（button
						や a 以外の要素なら tabindex を指定するなど）。
					</p>
					<div class="flex flex-wrap items-center gap-6 rounded border border-border p-6">
						<Tooltip label="上に表示します">
							<Button>ホバーしてください</Button>
						</Tooltip>
						<Tooltip label="下に表示します" placement="bottom">
							<Button>placement=bottom</Button>
						</Tooltip>
					</div>
					<CodeBlock lang="tsx">
						{`<Tooltip label="上に表示します">\n\t<Button>ホバーしてください</Button>\n</Tooltip>`}
					</CodeBlock>
				</div>
			</Section>
			<Section id="codeblock" title="CodeBlock">
				<div class="space-y-3">
					<p>
						lang を渡すと Shiki
						でハイライトします。ハイライトは同期的に行うため、SSG・SSR・CSR
						のいずれからでもそのまま呼び出せます。
					</p>
					<p>
						右上のボタンでコード全体をコピーできます。処理は onclick
						属性のインラインハンドラーだけで行うため、ハイドレーションなしに
						SSG・SSR・CSR のいずれでも動作します。クリップボード API
						が使えない環境では、代わりにコード全体を選択します。
					</p>
					<CodeBlock lang="tsx">{sampleTsx}</CodeBlock>
					<CodeBlock lang="css">{sampleCss}</CodeBlock>
					<p>
						コードブロックはページの配色に関わらず常にダークで表示します。配色は
						--color-code-* トークンで定義しており、Shiki
						のテーマ（vitesse-dark）と合わせています。
					</p>
					<p>lang を省略した場合はハイライトせずそのまま表示します。</p>
					<CodeBlock>{"cloudensis Inc."}</CodeBlock>
					<CodeBlock lang="tsx">
						{`<CodeBlock lang="tsx">{code}</CodeBlock>\n<CodeBlock>{code}</CodeBlock>`}
					</CodeBlock>
					<p>
						同梱している文法は css / html / javascript / json / markdown /
						shellscript / tsx / yaml です。 ts・jsx・jsonc・sh・md・yml
						などの別名も同じ文法として扱います。ここにない言語を lang
						に渡すことはできません（型で弾かれます）。
					</p>
					<table class="w-full border-collapse text-left text-sm">
						<thead>
							<tr class="border-border border-b">
								<th class="py-2 font-medium">lang に渡せる値</th>
								<th class="py-2 font-medium">文法</th>
							</tr>
						</thead>
						<tbody>
							{codeLanguages.map((language) => (
								<tr key={language.grammar} class="border-border border-b">
									<td class="py-2 pr-4 font-mono">{language.values}</td>
									<td class="py-2 text-fg-muted">{language.grammar}</td>
								</tr>
							))}
						</tbody>
					</table>

					<h3 class="pt-4 font-medium text-accent">バンドルサイズ</h3>
					<p>
						文法とテーマを同梱した同期版のハイライターを使うため、await
						は不要です。正規表現エンジンは WASM を必要としない JavaScript
						実装を選んでいるので、Cloudflare Workers
						やブラウザでもそのまま動作します。
					</p>
					<p>
						文法・テーマ・正規表現エンジンは CodeBlock（と
						lib/highlight）を読み込んだ時点でまとめてバンドルに含まれます。lang
						を渡さない場合も同じです。SSR・SSG
						では配信サイズに影響しませんが、CSR
						でクライアントのバンドルに含めると minify 後でおよそ 830 KB（gzip
						でおよそ 130 KB）増えます。クライアントで描画する必要がなければ、
						CodeBlock はサーバー側だけで使ってください。
					</p>

					<h3 class="pt-4 font-medium text-accent">コピーボタン</h3>
					<p>
						コピーに成功するとアイコンがチェックマークに変わり、2
						秒後に元に戻ります。クリップボード API が使えない環境（HTTP
						で配信している場合など）や書き込みが拒否された場合は、コード全体を選択した状態にするので、Ctrl
						/ Cmd + C でコピーできます。
					</p>

					<h3 class="pt-4 font-medium text-accent">CSP</h3>
					<p>
						コピーボタンはインラインハンドラーを使うため、CSP で script-src
						を制限している場合は、'unsafe-hashes'
						とハンドラーのハッシュを追加してください。許可されるのはこのハンドラーだけなので、'unsafe-inline'
						を追加する必要はありません（XSS
						への防御が大きく弱まるため、追加しないでください）。nonce や
						'strict-dynamic' と併用しても動作します。このサイトも同じ CSP
						で配信しています。
					</p>
					<CodeBlock>
						{`Content-Security-Policy: script-src 'self' 'unsafe-hashes' ${copyHandlerHash}`}
					</CodeBlock>
					<p>
						ハッシュはハンドラーの内容から計算するため、ハンドラーを変更したバージョンでは値が変わります。ハッシュが一致しない場合はコピーできなくなります（ブラウザのコンソールに違反が出力されます）。
					</p>
					<p>
						CSR では、require-trusted-types-for 'script'（Trusted
						Types）を強制しているページで描画するとエラーになります。インラインハンドラーを属性として設定する処理が拒否されるためです。
					</p>
				</div>
			</Section>
			<Section id="descriptionlist" title="DescriptionList">
				<div class="space-y-3">
					<p>term と details の組を、2 列のグリッドとして並べます。</p>
					<div class="rounded border border-border p-6">
						<DescriptionList
							items={[
								{ term: "会社名", details: "cloudensis" },
								{ term: "設立", details: "2026年9月17日" },
							]}
						/>
					</div>
					<CodeBlock lang="tsx">
						{`<DescriptionList\n\titems={[{ term: "会社名", details: "cloudensis" }]}\n/>`}
					</CodeBlock>
				</div>
			</Section>
			<Section id="section" title="Section">
				<div class="space-y-3">
					<p>
						見出し付きのセクションです。id を渡すとページ内リンクになります。
					</p>
					<div class="rounded border border-border p-6">
						<Section id="sample-section" title="セクションの見出し">
							<p>セクションの本文です。</p>
						</Section>
					</div>
					<CodeBlock lang="tsx">{`<Section id="services" title="事業内容">...</Section>`}</CodeBlock>
				</div>
			</Section>
			<Section id="header" title="Header">
				<div class="space-y-3">
					<p>
						サイト共通のヘッダーです。ロゴ + ブランド名を左に、children
						を右（ナビゲーションやボタンなど）に並べます。ロゴは
						LogoIcon（cloudensis のロゴマーク）で固定です。
					</p>
					<div class="rounded border border-border">
						<Header homeHref="/" title="cloudensis" />
					</div>
					<CodeBlock lang="tsx">
						{`<Header homeHref="/" title="cloudensis">\n\t<nav>...</nav>\n</Header>`}
					</CodeBlock>
				</div>
			</Section>
			<Section id="footer" title="Footer">
				<div class="space-y-3">
					<p>
						サイト共通のフッターです。コピーライト表記を左に、links （または
						children）を右に並べます。links の代わりに children
						を渡すと、右側を自由な内容に差し替えられます。
					</p>
					<div class="rounded border border-border">
						<Footer
							copyrightHolder="cloudensis"
							links={[{ href: "/privacy", label: "プライバシーポリシー" }]}
						/>
					</div>
					<CodeBlock lang="tsx">
						{`<Footer\n\tcopyrightHolder={company.name}\n\tlinks={[{ href: "/privacy", label: "プライバシーポリシー" }]}\n/>`}
					</CodeBlock>
				</div>
			</Section>
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
					<p>
						記事本文を囲む要素に .prose
						を付与すると、本文向けのスタイルが適用されます。見出し・段落・リスト・定義リスト・引用・コード・表・図版など、記事に現れる
						HTML タグを一通りカバーしています。
					</p>
					<CodeBlock lang="tsx">{`<article class="prose">...</article>`}</CodeBlock>
					<p>
						セレクタはすべて :where() で包んで詳細度を 0 にしたうえで @layer
						components に置いているため、本文中の要素に Tailwind
						のユーティリティクラスを指定すればいつでも上書きできます。 配色は
						トークンを参照しているので、@theme
						でトークンを差し替えると本文の見た目にもそのまま反映されます。
					</p>
				</div>
			</Section>
			<Section title="ブロック間の余白">
				<div class="space-y-3">
					<p>
						ブロックの余白は下方向にだけ持たせています。隣接する margin
						の相殺に頼らないため、.prose を flex や grid
						の中に置いても、ブロック同士の間隔は変わりません。
					</p>
					<p>
						見出しと hr の手前だけは例外で、直前のブロックの下余白を :has()
						で広げて距離を取ります。見出し側に上余白を持たせないので、
						余白が二重になることがありません。
					</p>
					<CodeBlock lang="css">{proseSpacingCss}</CodeBlock>
					<p>
						コンテナの先頭と末尾の余白は打ち消しているため、.prose
						を付けた要素に padding
						を与えても上下だけ広く見えることはありません。このページのサンプルも、枠線と
						padding を付けた要素に .prose を付けています。
					</p>
				</div>
			</Section>
			<Section title="対応している要素">
				<div class="space-y-3">
					<p>prose.css がスタイルを当てている HTML タグの一覧です。</p>
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
				<p>
					上の表に挙げたタグを実際に並べた記事です。余白・行間・配色の確認に使えます。
				</p>
				<article class="prose rounded border border-border p-6">
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
