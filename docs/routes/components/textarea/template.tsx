import { Textarea } from "../../../../src/components/textarea.tsx";

const importTsx = `import { Textarea } from "@cloudensis/design-system/components/textarea";

<Textarea rows={4} placeholder="お問い合わせ内容" />`;

export function Template() {
	return (
		<>
			<div class="space-y-4 rounded-sm border border-default p-6">
				<Textarea rows={4} aria-label="本文" placeholder="お問い合わせ内容" />
				<Textarea
					rows={2}
					aria-label="disabled"
					placeholder="disabled"
					disabled
				/>
			</div>
			<div class="prose">
				<pre>
					<code>{importTsx}</code>
				</pre>
			</div>
		</>
	);
}
