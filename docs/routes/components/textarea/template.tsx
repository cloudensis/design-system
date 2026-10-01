import { CodeBlock } from "../../../../src/components/code-block.tsx";
import { Textarea } from "../../../../src/components/textarea.tsx";

const importTsx = `import { Textarea } from "@cloudensis/design-system/components/textarea";

<label for="message">お問い合わせ内容</label>
<Textarea id="message" rows={4} />`;

export function Template() {
	return (
		<>
			<div class="space-y-4 rounded-sm border border-default p-6">
				<div class="space-y-1">
					<label for="sample-textarea" class="block text-sm">
						お問い合わせ内容
					</label>
					<Textarea
						id="sample-textarea"
						rows={4}
						placeholder="ご用件をお書きください"
					/>
				</div>
				<div class="space-y-1">
					<label for="sample-textarea-error" class="block text-sm">
						エラー
					</label>
					<Textarea
						id="sample-textarea-error"
						rows={2}
						aria-invalid="true"
						aria-describedby="sample-textarea-error-message"
					/>
					<p id="sample-textarea-error-message" class="text-danger text-sm">
						お問い合わせ内容を入力してください。
					</p>
				</div>
				<div class="space-y-1">
					<label for="sample-textarea-disabled" class="block text-sm">
						disabled
					</label>
					<Textarea
						id="sample-textarea-disabled"
						rows={2}
						placeholder="disabled"
						disabled
					/>
				</div>
			</div>
			<CodeBlock lang="tsx">{importTsx}</CodeBlock>
		</>
	);
}
