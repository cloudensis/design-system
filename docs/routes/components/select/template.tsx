import { Select } from "../../../../src/components/select.tsx";

const importTsx = `import { Select } from "@cloudensis/design-system/components/select";

<Select name="type">
	<option value="">選択してください</option>
	<option value="a">選択肢 A</option>
</Select>`;

export function Template() {
	return (
		<>
			<div class="space-y-4 rounded-sm border border-default p-6">
				<Select aria-label="選択肢">
					<option value="">選択してください</option>
					<option value="a">選択肢 A</option>
					<option value="b">選択肢 B</option>
				</Select>
				<Select aria-label="disabled" disabled>
					<option value="">disabled</option>
				</Select>
			</div>
			<div class="prose">
				<pre>
					<code>{importTsx}</code>
				</pre>
			</div>
		</>
	);
}
