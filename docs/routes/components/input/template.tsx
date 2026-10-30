import { CodeBlock } from "../../../../src/components/code-block.tsx";
import { Input } from "../../../../src/components/input.tsx";
import { cn } from "../../../../src/lib/utils.ts";
import shared from "../../shared.module.css";

const importTsx = `import { Input } from "@cloudensis/design-system/components/input";

<label for="email">メールアドレス</label>
<Input type="email" id="email" placeholder="name@example.com" />`;

const choiceTsx = `<label class={styles.choice}>
	<Input type="checkbox" name="agree" />
	利用規約に同意する
</label>

<fieldset>
	<legend>プラン</legend>
	<label class={styles.choice}>
		<Input type="radio" name="plan" value="free" />
		無料
	</label>
	<label class={styles.choice}>
		<Input type="radio" name="plan" value="pro" />
		有料
	</label>
</fieldset>`;

const errorTsx = `<label for="email">メールアドレス</label>
<Input type="email" id="email" aria-invalid="true" aria-describedby="email-error" />
<p id="email-error" class={styles.error}>メールアドレスの形式で入力してください。</p>`;

export function Template() {
	return (
		<>
			<div class={cn(shared.preview, shared.fields)}>
				<div class={shared.field}>
					<label for="sample-text" class={shared.label}>
						テキスト
					</label>
					<Input type="text" id="sample-text" placeholder="テキスト" />
				</div>
				<div class={shared.field}>
					<label for="sample-email" class={shared.label}>
						メールアドレス
					</label>
					<Input
						type="email"
						id="sample-email"
						placeholder="name@example.com"
					/>
				</div>
				<div class={shared.field}>
					<label for="sample-error" class={shared.label}>
						エラー
					</label>
					<Input
						type="email"
						id="sample-error"
						value="name@"
						aria-invalid="true"
						aria-describedby="sample-error-message"
					/>
					<p id="sample-error-message" class={shared.error}>
						メールアドレスの形式で入力してください。
					</p>
				</div>
				<div class={shared.field}>
					<label for="sample-disabled" class={shared.label}>
						disabled
					</label>
					<Input
						type="text"
						id="sample-disabled"
						placeholder="disabled"
						disabled
					/>
				</div>
				<label class={shared.choice}>
					<Input type="checkbox" />
					チェックボックス
				</label>
				<fieldset class={shared.fieldset}>
					<legend class={shared.legend}>ラジオボタン</legend>
					<label class={shared.choice}>
						<Input type="radio" name="sample-radio" />
						ラジオボタン A
					</label>
					<label class={shared.choice}>
						<Input type="radio" name="sample-radio" />
						ラジオボタン B
					</label>
				</fieldset>
				<label class={shared.choice}>
					<Input type="checkbox" disabled />
					disabled
				</label>
			</div>
			<CodeBlock lang="tsx">{importTsx}</CodeBlock>
			<div class="prose">
				<h2>チェックボックスとラジオボタン</h2>
				<p>
					type に checkbox / radio
					を渡すと、それぞれの見た目になります。ラベルで囲むと、文字をクリックしても選択できます。無効のときは
					:has(:disabled) でラベルも薄くします。
				</p>
				<p>
					ラジオボタンのように選択肢をまとめるときは、fieldset と legend
					で囲み、グループに名前を付けます。
				</p>
			</div>
			<CodeBlock lang="tsx">{choiceTsx}</CodeBlock>
			<div class="prose">
				<h2>エラー</h2>
				<p>
					aria-invalid="true" を付けると、枠線が danger
					の色になります。色だけでは伝わらないため、エラーの内容を文章で添え、aria-describedby
					で入力欄と結び付けます。Select と Textarea も同じです。
				</p>
			</div>
			<CodeBlock lang="tsx">{errorTsx}</CodeBlock>
		</>
	);
}
