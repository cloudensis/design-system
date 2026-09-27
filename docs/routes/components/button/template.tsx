import { Button } from "../../../../src/components/button.tsx";

const importTsx = `import { Button } from "@cloudensis/design-system/components/button";

<Button>保存する</Button>
<Button variant="outline">キャンセル</Button>
<Button size="sm">小さいボタン</Button>`;

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
				<Button variant="outline" size="sm">
					outline sm
				</Button>
			</div>
			<div class="prose">
				<pre>
					<code>{importTsx}</code>
				</pre>
			</div>
		</>
	);
}
