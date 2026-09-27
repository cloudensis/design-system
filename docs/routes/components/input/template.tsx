import { Input } from "../../../../src/components/input.tsx";

const importTsx = `import { Input } from "@cloudensis/design-system/components/input";

<Input type="email" placeholder="メールアドレス" />
<Input type="checkbox" id="agree" />`;

export function Template() {
	return (
		<>
			<div class="space-y-4 rounded-sm border border-default p-6">
				<Input type="text" aria-label="テキスト" placeholder="テキスト" />
				<Input
					type="email"
					aria-label="メールアドレス"
					placeholder="メールアドレス"
				/>
				<Input
					type="text"
					aria-label="disabled"
					placeholder="disabled"
					disabled
				/>
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
				<pre>
					<code>{importTsx}</code>
				</pre>
			</div>
		</>
	);
}
