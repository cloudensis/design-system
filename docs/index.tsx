import { Hono } from "hono";
import { raw } from "hono/html";
import { Button } from "../src/components/button.tsx";
import colorsCss from "../src/styles/colors.css?raw";
import styleUrl from "./style.css?url";

const colors = [...colorsCss.matchAll(/--([\w-]+):\s*([^;]+);/g)].map(
	([, name, value]) => ({ name, value: value.trim() }),
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
						<h1 class="font-medium text-3xl">cloudensis design system</h1>

						<section class="space-y-4">
							<h2 class="font-medium text-xl">Colors</h2>
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
							<h2 class="font-medium text-xl">Button</h2>
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
