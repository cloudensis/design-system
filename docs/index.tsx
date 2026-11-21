import { Hono } from "hono";
import { trimTrailingSlash } from "hono/trailing-slash";
import { type RouteModule, registerRoutes } from "./lib/router";
import { renderer } from "./renderer";
import { securityHeaders } from "./security-headers.ts";

const app = new Hono();

app.use(async (c, next) => {
	await next();
	for (const [name, value] of Object.entries(securityHeaders)) {
		c.res.headers.set(name, value);
	}
});
app.use(trimTrailingSlash({ alwaysRedirect: true }));
app.use(renderer);

registerRoutes(
	app,
	import.meta.glob<RouteModule>("./routes/**/index.{ts,tsx}", { eager: true }),
);

app.notFound((c) => {
	c.status(404);
	return c.render(<p>ページが見つかりません。</p>, {
		title: "404 Not Found",
		description: "ページが見つかりません",
		noindex: true,
	});
});

app.onError((err, c) => {
	console.error(err);
	c.status(500);
	return c.render(<p>サーバーエラーが発生しました。</p>, {
		title: "500 Internal Server Error",
		description: "サーバーエラーが発生しました",
		noindex: true,
	});
});

export default app;
