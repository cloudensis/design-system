import { CodeBlock } from "../../../../src/components/code-block.tsx";
import { Input } from "../../../../src/components/input.tsx";

const importTsx = `import { Input } from "@cloudensis/design-system/components/input";

<label for="email">メールアドレス</label>
<Input type="email" id="email" placeholder="name@example.com" />
<Input type="checkbox" id="agree" />`;

export function Template() {
	return (
		<>
			<div class="space-y-4 rounded-sm border border-default p-6">
				<div class="space-y-1">
					<label for="sample-text" class="block text-sm">
						テキスト
					</label>
					<Input type="text" id="sample-text" placeholder="テキスト" />
				</div>
				<div class="space-y-1">
					<label for="sample-email" class="block text-sm">
						メールアドレス
					</label>
					<Input
						type="email"
						id="sample-email"
						placeholder="name@example.com"
					/>
				</div>
				<div class="space-y-1">
					<label for="sample-disabled" class="block text-sm">
						disabled
					</label>
					<Input
						type="text"
						id="sample-disabled"
						placeholder="disabled"
						disabled
					/>
				</div>
				<div class="flex items-center gap-2">
					<Input type="checkbox" id="sample-checkbox" />
					<label for="sample-checkbox">チェックボックス</label>
				</div>
				<div class="flex items-center gap-2">
					<Input type="radio" id="sample-radio-a" name="sample-radio" />
					<label for="sample-radio-a">ラジオボタン A</label>
				</div>
				<div class="flex items-center gap-2">
					<Input type="radio" id="sample-radio-b" name="sample-radio" />
					<label for="sample-radio-b">ラジオボタン B</label>
				</div>
				<div class="flex items-center gap-2">
					<Input type="checkbox" id="sample-checkbox-disabled" disabled />
					<label for="sample-checkbox-disabled">disabled</label>
				</div>
			</div>
			<div class="prose">
				<p>type に checkbox / radio を渡すと、それぞれの見た目になります。</p>
			</div>
			<CodeBlock lang="tsx">{importTsx}</CodeBlock>
		</>
	);
}
