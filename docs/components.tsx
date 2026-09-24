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

/* /components ページの各セクション。サイドバーのリンクもこの配列から作ります。 */
export const componentSections: { name: string; body: Child }[] = [
	{
		name: "Button",
		body: (
			<div class="space-y-3">
				<div class="flex flex-wrap items-center gap-4 rounded border border-border p-6">
					<Button>ボタン</Button>
					<Button disabled>disabled</Button>
				</div>
				<CodeBlock lang="tsx">{`<Button>ボタン</Button>`}</CodeBlock>
			</div>
		),
	},
	{
		name: "LinkButton",
		body: (
			<div class="space-y-3">
				<p>見た目は Button と同じまま、a 要素としてレンダリングします。</p>
				<div class="flex flex-wrap items-center gap-4 rounded border border-border p-6">
					<LinkButton href="/">リンクボタン</LinkButton>
				</div>
				<CodeBlock lang="tsx">{`<LinkButton href="/">リンクボタン</LinkButton>`}</CodeBlock>
			</div>
		),
	},
	{
		name: "Input",
		body: (
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
		),
	},
	{
		name: "Select",
		body: (
			<div class="space-y-3">
				<div class="rounded border border-border p-6">
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
				<div class="rounded border border-border p-6">
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
		),
	},
	{
		name: "CodeBlock",
		body: (
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
					同梱している文法と、lang に渡せる値は次のとおりです。ここにない言語を
					lang に渡すことはできません（型で弾かれます）。
				</p>
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
					文法とテーマを同梱した同期版のハイライターを使うため、await
					は不要です。正規表現エンジンは WASM を必要としない JavaScript
					実装を選んでいるので、Cloudflare Workers
					やブラウザでもそのまま動作します。
				</p>
				<p>
					文法・テーマ・正規表現エンジンは CodeBlock（と
					lib/highlight）を読み込んだ時点でまとめてバンドルに含まれます。lang
					を渡さない場合も同じです。SSR・SSG では配信サイズに影響しませんが、CSR
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
				<CopyHandlerCsp />
				<p>
					ハッシュはハンドラーの内容から計算するため、ハンドラーを変更したバージョンでは値が変わります。ハッシュが一致しない場合はコピーできなくなります（ブラウザのコンソールに違反が出力されます）。
				</p>
				<p>
					CSR では、require-trusted-types-for 'script'（Trusted
					Types）を強制しているページで描画するとエラーになります。インラインハンドラーを属性として設定する処理が拒否されるためです。
				</p>
			</div>
		),
	},
	{
		name: "DescriptionList",
		body: (
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
		),
	},
	{
		name: "Section",
		body: (
			<div class="space-y-3">
				<p>見出し付きのセクションです。id を渡すとページ内リンクになります。</p>
				<div class="rounded border border-border p-6">
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
		),
	},
	{
		name: "Footer",
		body: (
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
		),
	},
];
