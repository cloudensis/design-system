import { CodeBlock } from "@cloudensis/design-system/components/code-block";
import { CheckIcon } from "@cloudensis/design-system/icons/check";
import { CopyIcon } from "@cloudensis/design-system/icons/copy";
import { MenuIcon } from "@cloudensis/design-system/icons/menu";
import { XIcon } from "@cloudensis/design-system/icons/x";
import { cn } from "@cloudensis/design-system/lib/utils";
import type { Handler } from "hono";
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

function Page() {
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

const ssg = true;

const GET: Handler = (c) =>
	c.render(<Page />, {
		title: "Icons",
		description: "アイコンコンポーネント",
	});

export { GET, ssg };
