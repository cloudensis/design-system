import { CodeBlock } from "../../../src/components/code-block.tsx";
import { CheckIcon } from "../../../src/icons/check.tsx";
import { CopyIcon } from "../../../src/icons/copy.tsx";
import { MenuIcon } from "../../../src/icons/menu.tsx";
import { XIcon } from "../../../src/icons/x.tsx";
import { cn } from "../../../src/lib/utils.ts";
import shared from "../shared.module.css";
import styles from "./icons.module.css";

const icons = [
	{ name: "CheckIcon", file: "check", Component: CheckIcon },
	{ name: "CopyIcon", file: "copy", Component: CopyIcon },
	{ name: "MenuIcon", file: "menu", Component: MenuIcon },
	{ name: "XIcon", file: "x", Component: XIcon },
];

const importTsx = `import { CheckIcon } from "@cloudensis/design-system/icons/check";

<CheckIcon />
<CheckIcon class={styles.largeIcon} />
<CheckIcon label="完了" />`;

export function Template() {
	return (
		<>
			<p>
				色は currentColor を使います。大きさは既定で 1rem 四方で、class
				で上書きできます。label
				を省略すると装飾として扱い、スクリーンリーダーから隠します。
			</p>
			<CodeBlock lang="tsx">{importTsx}</CodeBlock>
			<div class={shared.sections}>
				{icons.map(({ name, file, Component }) => (
					<section key={name} class={shared.section}>
						<h2 class={shared.heading3}>{name}</h2>
						<p class={shared.path}>@cloudensis/design-system/icons/{file}</p>
						<div class={cn(shared.preview, shared.row, styles.icons)}>
							<Component />
							<Component class={styles.size6} />
							<Component class={styles.size8} />
						</div>
					</section>
				))}
			</div>
		</>
	);
}
