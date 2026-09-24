import type { Child } from "hono/jsx";
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
import { codeLanguages } from "../src/lib/highlight.ts";
import { getCopyHandlerHash } from "./csp.ts";
import { sampleCss } from "./samples.ts";

const sampleTsx = `import { Button } from "@cloudensis/design-system/components/ui/button";

export function ContactForm() {
	return (
		<form method="post" action="/contact">
			<Button type="submit">送信する</Button>
		</form>
	);
}`;

async function CopyHandlerCsp() {
	const hash = await getCopyHandlerHash();
	return (
		<CodeBlock>
			{`Content-Security-Policy: script-src 'self' 'unsafe-hashes' ${hash}`}
		</CodeBlock>
	);
}

/* サイドバーのリンクもこの配列から作る。 */
export const componentSections: { name: string; body: Child }[] = [
	{
		name: "Button",
		body: (
			<div class="space-y-3">
				<div class="flex flex-wrap items-center gap-4 rounded-sm border border-border p-6">
					<Button>ボタン</Button>
					<Button disabled>disabled</Button>
				</div>
				<p>disabled で半透明になり、ホバーしても色が変わりません。</p>
				<CodeBlock lang="tsx">
					{`<Button>ボタン</Button>\n<Button disabled>disabled</Button>`}
				</CodeBlock>
			</div>
		),
	},
	{
		name: "LinkButton",
		body: (
			<div class="space-y-3">
				<p>Button と同じ見た目の a 要素です。</p>
				<div class="flex flex-wrap items-center gap-4 rounded-sm border border-border p-6">
					<LinkButton href="/">リンクボタン</LinkButton>
					<LinkButton aria-disabled="true">aria-disabled</LinkButton>
				</div>
				<p>
					無効にするときは href を外して aria-disabled="true" を指定します。
				</p>
				<CodeBlock lang="tsx">
					{`<LinkButton href="/">リンクボタン</LinkButton>\n<LinkButton aria-disabled="true">aria-disabled</LinkButton>`}
				</CodeBlock>
			</div>
		),
	},
	{
		name: "Input",
		body: (
			<div class="space-y-3">
				<p>type に checkbox / radio を渡すと、それぞれのスタイルになります。</p>
				<div class="flex flex-col gap-4 rounded-sm border border-border p-6">
					<Input type="text" placeholder="テキスト" />
					<Input type="email" placeholder="メールアドレス" />
					<Input type="text" placeholder="disabled" disabled />
					<Input
						type="email"
						aria-label="入力エラーの例"
						value="invalid@"
						aria-invalid="true"
					/>
					<div class="flex items-center gap-2">
						<Input id="sample-checkbox" type="checkbox" />
						<label htmlFor="sample-checkbox">チェックボックス</label>
					</div>
					<div class="flex items-center gap-2">
						<Input id="sample-radio" type="radio" name="sample" />
						<label htmlFor="sample-radio">ラジオボタン</label>
					</div>
				</div>
				<p>
					disabled で半透明、aria-invalid="true" で枠線が --color-danger
					になります。Select と Textarea も同じです。
				</p>
				<CodeBlock lang="tsx">
					{`<Input type="text" placeholder="テキスト" />\n<Input type="text" disabled />\n<Input type="email" aria-invalid="true" />\n<Input type="checkbox" />\n<Input type="radio" name="sample" />`}
				</CodeBlock>
			</div>
		),
	},
	{
		name: "Select",
		body: (
			<div class="space-y-3">
				<div class="rounded-sm border border-border p-6">
					<Select aria-label="選択肢">
						<option value="">選択してください</option>
						<option value="a">選択肢 A</option>
						<option value="b">選択肢 B</option>
					</Select>
				</div>
				<CodeBlock lang="tsx">
					{`<Select>\n\t<option value="">選択してください</option>\n</Select>`}
				</CodeBlock>
			</div>
		),
	},
	{
		name: "Textarea",
		body: (
			<div class="space-y-3">
				<div class="rounded-sm border border-border p-6">
					<Textarea rows={4} placeholder="お問い合わせ内容" />
				</div>
				<CodeBlock lang="tsx">{`<Textarea rows={4} placeholder="お問い合わせ内容" />`}</CodeBlock>
			</div>
		),
	},
	{
		name: "Tooltip",
		body: (
			<div class="space-y-3">
				<p>
					ホバーとフォーカスで補足を表示します。CSS
					だけで動き、表示中もクリックを遮りません。
				</p>
				<p>
					キーボードで表示するには、中の要素がフォーカスできる必要があります（tabindex
					など）。
				</p>
				<div class="flex flex-wrap items-center gap-6 rounded-sm border border-border p-6">
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
		),
	},
	{
		name: "CodeBlock",
		body: (
			<div class="space-y-3">
				<p>
					lang を渡すと Shiki
					でハイライトします。同期的に動くので、SSG・SSR・CSR
					のどこからでも使えます。
				</p>
				<p>
					右上のボタンでコードをコピーできます。インラインハンドラーだけで動くため、ハイドレーションは不要です。
				</p>
				<CodeBlock lang="tsx">{sampleTsx}</CodeBlock>
				<CodeBlock lang="css">{sampleCss}</CodeBlock>
				<p>ページの配色に関わらず常にダークで、配色は --color-code-* です。</p>
				<p>lang を省略するとハイライトしません。</p>
				<CodeBlock>{"cloudensis Inc."}</CodeBlock>
				<CodeBlock lang="tsx">
					{`<CodeBlock lang="tsx">{code}</CodeBlock>\n<CodeBlock>{code}</CodeBlock>`}
				</CodeBlock>
				<p>lang に渡せる値です。ほかの値は型エラーになります。</p>
				<table class="w-full border-collapse text-left text-sm">
					<thead>
						<tr class="border-border border-b">
							<th class="py-2 font-medium">lang に渡せる値</th>
							<th class="py-2 font-medium">文法</th>
						</tr>
					</thead>
					<tbody>
						{Object.entries(codeLanguages).map(([grammar, values]) => (
							<tr key={grammar} class="border-border border-b">
								<td class="py-2 pr-4 font-mono">{values.join(" / ")}</td>
								<td class="py-2 text-fg-muted">{grammar}</td>
							</tr>
						))}
					</tbody>
				</table>

				<h3 class="pt-4 font-medium text-accent">バンドルサイズ</h3>
				<p>
					正規表現エンジンに WASM 不要の JavaScript
					実装を使っているため、Cloudflare Workers やブラウザでも動きます。
				</p>
				<p>
					文法とテーマは CodeBlock（と
					lib/highlight）を読み込むとバンドルに含まれます。CSR
					で使うとクライアントのバンドルが minify 後で約 830 KB（gzip で約 130
					KB）増えるため、できるだけサーバー側で使ってください。
				</p>

				<h3 class="pt-4 font-medium text-accent">コピーボタン</h3>
				<p>
					コピーするとアイコンが 2 秒間チェックマークになります。クリップボード
					API が使えない場合は、コード全体を選択します。
				</p>

				<h3 class="pt-4 font-medium text-accent">CSP</h3>
				<p>
					CSP で script-src を制限している場合は、'unsafe-hashes'
					と次のハッシュを追加してください。'unsafe-inline' は不要です。
				</p>
				<CopyHandlerCsp />
				<p>ハッシュはハンドラーを変えたバージョンで変わります。</p>
				<p>
					CSR では、Trusted Types（require-trusted-types-for
					'script'）を強制したページで描画するとエラーになります。
				</p>
			</div>
		),
	},
	{
		name: "DescriptionList",
		body: (
			<div class="space-y-3">
				<p>term と details を 2 列で並べます。</p>
				<div class="rounded-sm border border-border p-6">
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
		),
	},
	{
		name: "Section",
		body: (
			<div class="space-y-3">
				<p>見出し付きのセクションです。id でページ内リンクにできます。</p>
				<div class="rounded-sm border border-border p-6">
					<Section id="sample-section" title="セクションの見出し">
						<p>セクションの本文です。</p>
					</Section>
				</div>
				<CodeBlock lang="tsx">{`<Section id="services" title="事業内容">...</Section>`}</CodeBlock>
			</div>
		),
	},
	{
		name: "Header",
		body: (
			<div class="space-y-3">
				<p>ロゴ（LogoIcon）とブランド名を左、children を右に並べます。</p>
				<div class="rounded-sm border border-border">
					<Header homeHref="/" title="cloudensis" />
				</div>
				<CodeBlock lang="tsx">
					{`<Header homeHref="/" title="cloudensis">\n\t<nav>...</nav>\n</Header>`}
				</CodeBlock>
			</div>
		),
	},
	{
		name: "Footer",
		body: (
			<div class="space-y-3">
				<p>コピーライトを左、links（または children）を右に並べます。</p>
				<div class="rounded-sm border border-border">
					<Footer
						copyrightHolder="cloudensis"
						links={[{ href: "/privacy", label: "プライバシーポリシー" }]}
					/>
				</div>
				<CodeBlock lang="tsx">
					{`<Footer\n\tcopyrightHolder={company.name}\n\tlinks={[{ href: "/privacy", label: "プライバシーポリシー" }]}\n/>`}
				</CodeBlock>
			</div>
		),
	},
];
