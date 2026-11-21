import { Hono } from "hono";
import { trimTrailingSlash } from "hono/trailing-slash";
import { type RouteModule, registerRoutes } from "./lib/router";
import { moduleStyles, moduleStylesPath } from "./module-styles.ts";
import { renderer } from "./renderer";

const app = new Hono();

app.use(trimTrailingSlash({ alwaysRedirect: true }));

/* SSG で静的ファイルとして書き出す。URL にハッシュを付けているので、長くキャッシュしてよい。 */
app.get(moduleStylesPath, (c) =>
	c.body(moduleStyles, 200, {
		"Content-Type": "text/css; charset=utf-8",
		"Cache-Control": "public, max-age=31536000, immutable",
	}),
);

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
