import { CodeBlock } from "../../../../src/components/code-block.tsx";
import { Select } from "../../../../src/components/select.tsx";
import { cn } from "../../../../src/lib/utils.ts";
import shared from "../../shared.module.css";

const importTsx = `import { Select } from "@cloudensis/design-system/components/select";

<label for="type">種類</label>
<Select id="type" name="type">
	<option value="">選択してください</option>
	<option value="a">選択肢 A</option>
</Select>`;

export function Template() {
	return (
		<>
			<div class={cn(shared.preview, shared.fields)}>
				<div class={shared.field}>
					<label for="sample-select" class={shared.label}>
						選択肢
					</label>
					<Select id="sample-select">
						<option value="">選択してください</option>
						<option value="a">選択肢 A</option>
						<option value="b">選択肢 B</option>
					</Select>
				</div>
				<div class={shared.field}>
					<label for="sample-select-error" class={shared.label}>
						エラー
					</label>
					<Select
						id="sample-select-error"
						aria-invalid="true"
						aria-describedby="sample-select-error-message"
					>
						<option value="">選択してください</option>
						<option value="a">選択肢 A</option>
						<option value="b">選択肢 B</option>
					</Select>
					<p id="sample-select-error-message" class={shared.error}>
						選択してください。
					</p>
				</div>
				<div class={shared.field}>
					<label for="sample-select-disabled" class={shared.label}>
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
