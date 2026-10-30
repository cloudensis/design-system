import { cn } from "../../../../src/lib/utils.ts";
import colorsCss from "../../../../src/styles/colors.css?raw";
import shared from "../../shared.module.css";
import styles from "./colors.module.css";

const colors = [...colorsCss.matchAll(/--([\w-]+):\s*([^;]+);/g)].map(
	([, name, value]) => ({ name, value: value.trim() }),
);

function Swatch({ name, value }: { name: string; value: string }) {
	const onEmphasis = name.endsWith("-on-emphasis") && styles.onEmphasis;

	if (name.startsWith("text-color-")) {
		return (
			<span
				aria-hidden="true"
				class={cn(styles.swatch, styles.text, onEmphasis)}
				style={`color: ${value}`}
			/>
		);
	}
	if (name.startsWith("border-color-")) {
		return (
			<span
				class={cn(styles.swatch, styles.border, onEmphasis)}
				style={`border-color: ${value}`}
			/>
		);
	}
	if (name.startsWith("outline-color-")) {
		return (
			<span
				class={cn(styles.swatch, styles.outline)}
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
				class={styles.checkbox}
				style={`accent-color: ${value}`}
			/>
		);
	}
	return <span class={styles.swatch} style={`background-color: ${value}`} />;
}

export function Template() {
	return (
		<table class={shared.table}>
			<thead>
				<tr>
					<th>名前</th>
					<th>値</th>
					<th>見本</th>
				</tr>
			</thead>
			<tbody>
				{colors.map(({ name, value }) => (
					<tr key={name}>
						<td class={shared.mono}>--{name}</td>
						<td class={shared.mono}>{value}</td>
						<td>
							<Swatch name={name} value={value} />
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}
