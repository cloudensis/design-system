import { Hono } from "hono";
import { jsxRenderer, useRequestContext } from "hono/jsx-renderer";
import { Template as HomeTemplate } from "./routes/template.tsx";
import styleUrl from "./style.css?url";

const siteName = "cloudensis design system";

const renderer = jsxRenderer(({ children }) => {
	const c = useRequestContext();
	const ogImageUrl = new URL("/ogp.png", c.req.url).toString();

	return (
		<html lang="ja">
			<head>
				<meta charset="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<title>{siteName}</title>
				<meta property="og:type" content="website" />
				<meta property="og:title" content={siteName} />
				<meta property="og:image" content={ogImageUrl} />
				<meta property="og:image:width" content="1200" />
				<meta property="og:image:height" content="630" />
				<meta name="twitter:card" content="summary_large_image" />
				<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
				<link rel="apple-touch-icon" href="/logo.png" />
				<link rel="stylesheet" href={styleUrl} />
			</head>
			<body>
				<main class="mx-auto max-w-3xl space-y-12 px-6 py-12">{children}</main>
			</body>
		</html>
	);
});

const app = new Hono();

app.use(renderer);

app.get("/", (c) => c.render(<HomeTemplate />));

export default app;
