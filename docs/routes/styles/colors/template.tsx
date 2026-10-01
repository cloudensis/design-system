import colorsCss from "../../../../src/styles/colors.css?raw";

const colors = [...colorsCss.matchAll(/--([\w-]+):\s*([^;]+);/g)].map(
	([, name, value]) => ({ name, value: value.trim() }),
);

function Swatch({ name, value }: { name: string; value: string }) {
	const onEmphasis = name.endsWith("-on-emphasis") ? "bg-emphasis" : "";

	if (name.startsWith("text-color-")) {
		return (
			<span
				aria-hidden="true"
				class={`inline-flex size-6 items-center justify-center rounded-sm align-middle font-medium before:content-['Aa'] ${onEmphasis}`}
				style={`color: ${value}`}
			/>
		);
	}
	if (name.startsWith("border-color-")) {
		return (
			<span
				class={`inline-block size-6 rounded-sm border align-middle ${onEmphasis}`}
				style={`border-color: ${value}`}
			/>
		);
	}
	if (name.startsWith("outline-color-")) {
		return (
			<span
				class="inline-block size-6 rounded-sm align-middle outline-2"
				style={`outline-color: ${value}`}
			/>
		);
	}
	if (name.startsWith("accent-color-")) {
		return (
			<input
				type="checkbox"
				checked
				inert
				class="size-4 align-middle"
				style={`accent-color: ${value}`}
			/>
		);
	}
	return (
		<span
			class="inline-block size-6 rounded-sm align-middle"
			style={`background-color: ${value}`}
		/>
	);
}

export function Template() {
	return (
		<table class="w-full text-left text-sm">
			<thead>
				<tr>
					<th class="py-2 font-medium">名前</th>
					<th class="py-2 font-medium">値</th>
					<th class="py-2 font-medium">見本</th>
				</tr>
			</thead>
			<tbody>
				{colors.map(({ name, value }) => (
					<tr key={name}>
						<td class="py-2 font-mono">--{name}</td>
						<td class="py-2 font-mono">{value}</td>
						<td class="py-2">
							<Swatch name={name} value={value} />
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}
