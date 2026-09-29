import { CodeBlock } from "../../../src/components/code-block.tsx";
import { CheckIcon } from "../../../src/icons/check.tsx";
import { CopyIcon } from "../../../src/icons/copy.tsx";
import { MenuIcon } from "../../../src/icons/menu.tsx";
import { XIcon } from "../../../src/icons/x.tsx";

const icons = [
	{ name: "CheckIcon", file: "check", Component: CheckIcon },
	{ name: "CopyIcon", file: "copy", Component: CopyIcon },
	{ name: "MenuIcon", file: "menu", Component: MenuIcon },
	{ name: "XIcon", file: "x", Component: XIcon },
];

const importTsx = `import { CheckIcon } from "@cloudensis/design-system/icons/check";

<CheckIcon />
<CheckIcon class="size-6" />
<CheckIcon label="完了" />`;

export function Template() {
	return (
		<>
			<p>
				色は currentColor を使います。大きさは既定で size-4 で、class
				で上書きできます。label
				を省略すると装飾として扱い、スクリーンリーダーから隠します。
			</p>
			<CodeBlock lang="tsx">{importTsx}</CodeBlock>
			<div class="space-y-10">
				{icons.map(({ name, file, Component }) => (
					<section key={name} class="space-y-3">
						<h2 class="text-heading-3">{name}</h2>
						<p class="break-all font-mono text-xs">
							@cloudensis/design-system/icons/{file}
						</p>
						<div class="flex flex-wrap items-center gap-6 rounded-sm border border-default p-6">
							<Component />
							<Component class="size-6" />
							<Component class="size-8" />
						</div>
					</section>
				))}
			</div>
		</>
	);
}
