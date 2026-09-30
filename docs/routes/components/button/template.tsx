import { Button, LinkButton } from "../../../../src/components/button.tsx";
import { CodeBlock } from "../../../../src/components/code-block.tsx";
import { MenuIcon } from "../../../../src/icons/menu.tsx";

const importTsx = `import { Button } from "@cloudensis/design-system/components/button";
import { MenuIcon } from "@cloudensis/design-system/icons/menu";

<Button>保存する</Button>
<Button variant="outline">キャンセル</Button>
<Button size="sm">小さいボタン</Button>
<Button variant="outline" size="icon" aria-label="メニュー">
	<MenuIcon />
</Button>`;

const linkTsx = `import { LinkButton } from "@cloudensis/design-system/components/button";

<LinkButton href="/contact">お問い合わせ</LinkButton>
<LinkButton aria-disabled="true">無効なリンク</LinkButton>`;

export function Template() {
	return (
		<>
			<div class="flex flex-wrap gap-4 rounded-sm border border-default p-6">
				<Button>default</Button>
				<Button disabled>default disabled</Button>
				<Button variant="outline">outline</Button>
				<Button variant="outline" disabled>
					outline disabled
				</Button>
			</div>
			<div class="flex flex-wrap items-center gap-4 rounded-sm border border-default p-6">
				<Button size="sm">sm</Button>
				<Button size="sm" disabled>
					sm disabled
				</Button>
				<Button variant="outline" size="sm">
					outline sm
				</Button>
				<Button variant="outline" size="sm" disabled>
					outline sm disabled
				</Button>
			</div>
			<div class="flex flex-wrap items-center gap-4 rounded-sm border border-default p-6">
				<Button size="icon" aria-label="icon">
					<MenuIcon />
				</Button>
				<Button size="icon" aria-label="icon disabled" disabled>
					<MenuIcon />
				</Button>
				<Button variant="outline" size="icon" aria-label="outline icon">
					<MenuIcon />
				</Button>
				<Button
					variant="outline"
					size="icon"
					aria-label="outline icon disabled"
					disabled
				>
					<MenuIcon />
				</Button>
			</div>
			<p>
				size="icon" はアイコンだけのボタンです。文字がないため、aria-label
				で名前を付けます。
			</p>
			<CodeBlock lang="tsx">{importTsx}</CodeBlock>

			<h2 class="text-heading-2">LinkButton</h2>
			<p>
				Button と同じ見た目の a 要素です。variant と size も同じものを使えます。
			</p>
			<div class="flex flex-wrap gap-4 rounded-sm border border-default p-6">
				<LinkButton href="/">default</LinkButton>
				<LinkButton aria-disabled="true">default disabled</LinkButton>
				<LinkButton href="/" variant="outline">
					outline
				</LinkButton>
				<LinkButton variant="outline" aria-disabled="true">
					outline disabled
				</LinkButton>
			</div>
			<div class="flex flex-wrap items-center gap-4 rounded-sm border border-default p-6">
				<LinkButton href="/" size="sm">
					sm
				</LinkButton>
				<LinkButton size="sm" aria-disabled="true">
					sm disabled
				</LinkButton>
				<LinkButton href="/" variant="outline" size="sm">
					outline sm
				</LinkButton>
				<LinkButton variant="outline" size="sm" aria-disabled="true">
					outline sm disabled
				</LinkButton>
			</div>
			<p>無効にするときは href を外し、aria-disabled="true" を付けます。</p>
			<CodeBlock lang="tsx">{linkTsx}</CodeBlock>
		</>
	);
}
