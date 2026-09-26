import { Hono } from "hono";
import { raw } from "hono/html";
import { LogoLockup } from "../src/brand/logo-lockup.tsx";
import { LogoMark } from "../src/brand/logo-mark.tsx";
import { LogoType } from "../src/brand/logo-type.tsx";
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

const fonts = [...typographyCss.matchAll(/^\s*--font-([\w-]+):\s*([^;]+);/gm)].map(
	([, name, value]) => ({ name, value: value.trim().replace(/\s+/g, " ") }),
);

const app = new Hono();

app.get("/", (c) => {
	const ogImageUrl = new URL("/ogp.png", c.req.url).toString();
	return c.html(
		<>
			{raw("<!doctype html>")}
			<html lang="ja">
				<head>
					<meta charset="utf-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<title>cloudensis design system</title>
					<meta property="og:type" content="website" />
					<meta property="og:title" content="cloudensis design system" />
					<meta property="og:image" content={ogImageUrl} />
					<meta property="og:image:width" content="1200" />
					<meta property="og:image:height" content="630" />
					<meta name="twitter:card" content="summary_large_image" />
					<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
					<link rel="apple-touch-icon" href="/logo.png" />
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
									{fonts.map(({ name, value }) => (
										<tr key={name}>
											<td class="whitespace-nowrap py-2 pr-4 font-mono">font-{name}</td>
											<td class="py-2 font-mono">{value}</td>
											<td class="py-2 text-lg" style={`font-family: ${value}`}>
												Aa あア亜 0123
											</td>
										</tr>
									))}
								</tbody>
							</table>
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
							<h2 class="text-heading-2">Brand</h2>
							<table class="w-full text-left text-sm">
								<thead>
									<tr>
										<th class="py-2 font-medium">コンポーネント</th>
										<th class="py-2 font-medium">見本</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td class="py-2 font-mono">LogoMark</td>
										<td class="py-2">
											<LogoMark label="cloudensis" />
										</td>
									</tr>
									<tr>
										<td class="py-2 font-mono">LogoType</td>
										<td class="py-2 text-xl">
											<LogoType />
										</td>
									</tr>
									<tr>
										<td class="py-2 font-mono">LogoLockup</td>
										<td class="space-y-2 py-2">
											<div>
												<LogoLockup />
											</div>
											<div>
												<LogoLockup class="text-3xl" />
											</div>
										</td>
									</tr>
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
	);
});

export default app;
