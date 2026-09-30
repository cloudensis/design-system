import { CodeBlock } from "../../../../src/components/code-block.tsx";
import { Select } from "../../../../src/components/select.tsx";

const importTsx = `import { Select } from "@cloudensis/design-system/components/select";

<label for="type">種類</label>
<Select id="type" name="type">
	<option value="">選択してください</option>
	<option value="a">選択肢 A</option>
</Select>`;

export function Template() {
	return (
		<>
			<div class="space-y-4 rounded-sm border border-default p-6">
				<div class="space-y-1">
					<label for="sample-select" class="block text-sm">
						選択肢
					</label>
					<Select id="sample-select">
						<option value="">選択してください</option>
						<option value="a">選択肢 A</option>
						<option value="b">選択肢 B</option>
					</Select>
				</div>
				<div class="space-y-1">
					<label for="sample-select-disabled" class="block text-sm">
						disabled
					</label>
					<Select id="sample-select-disabled" disabled>
						<option value="">disabled</option>
					</Select>
				</div>
			</div>
			<CodeBlock lang="tsx">{importTsx}</CodeBlock>
		</>
	);
}
