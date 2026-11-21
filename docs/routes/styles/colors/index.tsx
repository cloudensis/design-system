import type { Handler } from "hono";
import { cn } from "../../../../src/lib/utils.ts";
import colorsCss from "../../../../src/styles/colors.css?raw";
import paletteCss from "../../../../src/styles/palette.css?raw";
import shared from "../../shared.module.css";
import styles from "./colors.module.css";

const parseTokens = (css: string) =>
	[...css.matchAll(/--([\w-]+):\s*([^;]+);/g)].map(([, name, value]) => {
		const normalized = value.replace(/\s+/g, " ").trim();
		const [, light, dark] =
			normalized.match(/^light-dark\(\s*(.+?),\s*(.+?)\s*\)$/) ?? [];
		return {
			name,
			light: light ?? normalized,
			dark: dark ?? normalized,
		};
	});

const colors = parseTokens(colorsCss);
const palette = parseTokens(paletteCss);

function Swatch({ name, value }: { name: string; value: string }) {
	const onEmphasis =
		(name.endsWith("-on-emphasis") && styles.onEmphasis) ||
		(name.endsWith("-on-code") && styles.onCode);

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

function Page() {
	return (
		<>
			<div class="prose">
				<p>
					コンポーネントや利用側では、ここに並ぶセマンティックな色を使います。見本は今のテーマで表示しています。
				</p>
				<p>
					既定はライトです。html 要素に data-theme="dark"
					を付けるとダーク、data-theme="auto" を付けると OS
					の設定に従います（このサイトは auto）。
				</p>
			</div>
			<table class={shared.table}>
				<thead>
					<tr>
						<th>名前</th>
						<th>ライト</th>
						<th>ダーク</th>
						<th>見本</th>
					</tr>
				</thead>
				<tbody>
					{colors.map(({ name, light, dark }) => (
						<tr key={name}>
							<td class={shared.mono}>--{name}</td>
							<td class={shared.mono}>{light}</td>
							<td class={shared.mono}>{dark}</td>
							<td>
								<Swatch name={name} value={`var(--${name})`} />
							</td>
						</tr>
					))}
				</tbody>
			</table>

			<h2 class={shared.heading2}>パレット</h2>
			<p>
				セマンティックな色の元になるプリミティブな色です。直接は使わず、セマンティックな色を通して使います。
			</p>
			<table class={shared.table}>
				<thead>
					<tr>
						<th>名前</th>
						<th>値</th>
						<th>見本</th>
					</tr>
				</thead>
				<tbody>
					{palette.map(({ name, light }) => (
						<tr key={name}>
							<td class={shared.mono}>--{name}</td>
							<td class={shared.mono}>{light}</td>
							<td>
								<span
									class={cn(styles.swatch, styles.paletteSwatch)}
									style={`background-color: var(--${name})`}
								/>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</>
	);
}

const ssg = true;

const GET: Handler = (c) =>
	c.render(<Page />, {
		title: "Colors",
		description: "色のトークン",
	});

export { GET, ssg };
