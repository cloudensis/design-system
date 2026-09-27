import { Button } from "../../../../src/components/button.tsx";

const importTsx = `import { Button } from "@cloudensis/design-system/components/button";`;

export function Template() {
	return (
		<>
			<div class="flex flex-wrap gap-4 rounded-sm border border-default p-6">
				<Button>ボタン</Button>
				<Button disabled>disabled</Button>
			</div>
			<div class="prose">
				<pre>
					<code>{importTsx}</code>
				</pre>
			</div>
		</>
	);
}
