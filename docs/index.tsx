import { Hono } from "hono";
import { raw } from "hono/html";
import { Button } from "../src/components/button.tsx";
import colorsCss from "../src/styles/colors.css?raw";
import typographyCss from "../src/styles/typography.css?raw";
import styleUrl from "./style.css?url";

const colors = [...colorsCss.matchAll(/--([\w-]+):\s*([^;]+);/g)].map(
	([, name, value]) => ({ name, value: value.trim() }),
);

/* --text-heading-1--line-height などの修飾子を、親の名前ごとにまとめる。 */
const typography = [
	...typographyCss.matchAll(/--text-([\w-]+?):\s*([^;]+);/g),
].reduce<Record<string, Record<string, string>>>(
	(styles, [, name, value]) => {
		const [base, property = "font-size"] = name.split("--");
		styles[base] = { ...styles[base], [property]: value.trim() };
		return styles;
	},
	{},
);

const app = new Hono();

app.get("/", (c) =>
	c.html(
		<>
			{raw("<!doctype html>")}
			<html lang="ja">
				<head>
					<meta charset="utf-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<title>cloudensis design system</title>
					<link rel="stylesheet" href={styleUrl} />
				</head>
				<body class="bg-default text-default">
					<main class="mx-auto max-w-3xl space-y-12 px-6 py-12">
						<h1 class="text-heading-1">cloudensis design system</h1>

						<section class="space-y-4">
							<h2 class="text-heading-2">Colors</h2>
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
												<span
													class="inline-block size-6 rounded-sm border align-middle"
													style={`background-color: ${value}`}
												/>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</section>

						<section class="space-y-4">
							<h2 class="text-heading-2">Typography</h2>
							<table class="w-full text-left text-sm">
								<thead>
									<tr>
										<th class="py-2 font-medium">クラス</th>
										<th class="py-2 font-medium">値</th>
										<th class="py-2 font-medium">見本</th>
									</tr>
								</thead>
								<tbody>
									{Object.entries(typography).map(([name, style]) => (
										<tr key={name}>
											<td class="py-2 font-mono">text-{name}</td>
											<td class="py-2 font-mono">
												{Object.entries(style).map(([property, value]) => (
													<div key={property}>
														{property}: {value}
													</div>
												))}
											</td>
											<td
												class="py-2"
												style={Object.entries(style)
													.map(([property, value]) => `${property}: ${value}`)
													.join("; ")}
											>
												見出し Heading
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</section>

						<section class="space-y-4">
							<h2 class="text-heading-2">Button</h2>
							<div class="flex flex-wrap gap-4">
								<Button>ボタン</Button>
								<Button disabled>disabled</Button>
							</div>
						</section>
					</main>
				</body>
			</html>
		</>,
	),
);

export default app;
