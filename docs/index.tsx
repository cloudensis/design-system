import { Hono } from "hono";
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
			</Section>
			<Section title="既定のスタイル">
				<p>
					body には --color-bg / --color-fg
					とライト（300）の文字の太さが既定で適用されます。b / strong は
					--font-weight-strong（500）です。 利用側で bg-* や text-*、font-*
					のユーティリティクラスを指定すればいつでも上書きできます。
				</p>
				<CodeBlock lang="css">
					{`body {\n\tbackground-color: var(--color-bg);\n\tcolor: var(--color-fg);\n\tfont-weight: var(--font-weight-base);\n}\n\nb,\nstrong {\n\tfont-weight: var(--font-weight-strong);\n}`}
				</CodeBlock>
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
									{token.name.startsWith("--color-") ? (
										<span
											class="inline-block size-6 rounded border border-border align-middle"
											style={`background: var(${token.name})`}
										/>
									) : token.name.startsWith("--font-weight-") ? (
										<span style={`font-weight: var(${token.name})`}>
											Aa あア亜 0123
										</span>
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
				<CodeBlock lang="tsx">{`<Button>ボタン</Button>`}</CodeBlock>
			</Section>
			<Section title="LinkButton">
				<p>見た目は Button と同じまま、a 要素としてレンダリングします。</p>
				<div class="flex flex-wrap items-center gap-4 rounded border border-border p-6">
					<LinkButton href="/">リンクボタン</LinkButton>
				</div>
				<CodeBlock lang="tsx">{`<LinkButton href="/">リンクボタン</LinkButton>`}</CodeBlock>
			</Section>
			<Section title="Input">
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
			</Section>
			<Section title="Select">
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
			</Section>
			<Section title="Textarea">
				<div class="rounded border border-border p-6">
					<Textarea rows={4} placeholder="お問い合わせ内容" />
				</div>
				<CodeBlock lang="tsx">{`<Textarea rows={4} placeholder="お問い合わせ内容" />`}</CodeBlock>
			</Section>
			<Section title="Tooltip">
				<p>
					ホバー（とフォーカス）で補足を表示します。開閉は CSS
					だけで行うため、クライアント JavaScript を読み込まずに動作します。
					ラベルは pointer-events-none
					なので、表示中でもクリックやホバーを遮りません。
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
			</Section>
			<Section title="CodeBlock">
				<p>
					lang を渡すと Shiki
					でハイライトします。ハイライトは同期的に行うため、SSG・SSR・CSR
					のいずれからでもそのまま呼び出せます。
				</p>
				<p>
					コードは user-select: all を指定しているため、クリック 1
					回で全体が選択されます。あとは Ctrl / Cmd + C でコピーできます。
					その操作はホバー時のツールチップで案内しており、クライアント
					JavaScript は一切読み込みません。
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
					などの別名も同じ文法として扱います。
				</p>
			</Section>
			<Section title="DescriptionList">
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
			</Section>
			<Section title="Section">
				<p>見出し付きのセクションです。id を渡すとページ内リンクになります。</p>
				<div class="rounded border border-border p-6">
					<Section id="sample-section" title="セクションの見出し">
						<p>セクションの本文です。</p>
					</Section>
				</div>
				<CodeBlock lang="tsx">{`<Section id="services" title="事業内容">...</Section>`}</CodeBlock>
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
				<CodeBlock lang="tsx">{`<article class="prose">...</article>`}</CodeBlock>
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
