import { CodeBlock } from "../../../../src/components/code-block.tsx";
import { Textarea } from "../../../../src/components/textarea.tsx";
import { cn } from "../../../../src/lib/utils.ts";
import shared from "../../shared.module.css";

const importTsx = `import { Textarea } from "@cloudensis/design-system/components/textarea";

<label for="message">お問い合わせ内容</label>
<Textarea id="message" rows={4} />`;

export function Template() {
	return (
		<>
			<div class={cn(shared.preview, shared.fields)}>
				<div class={shared.field}>
					<label for="sample-textarea" class={shared.label}>
						お問い合わせ内容
					</label>
					<Textarea
						id="sample-textarea"
						rows={4}
						placeholder="ご用件をお書きください"
					/>
				</div>
				<div class={shared.field}>
					<label for="sample-textarea-error" class={shared.label}>
						エラー
					</label>
					<Textarea
						id="sample-textarea-error"
						rows={2}
						aria-invalid="true"
						aria-describedby="sample-textarea-error-message"
					/>
					<p id="sample-textarea-error-message" class={shared.error}>
						お問い合わせ内容を入力してください。
					</p>
				</div>
				<div class={shared.field}>
					<label for="sample-textarea-disabled" class={shared.label}>
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
