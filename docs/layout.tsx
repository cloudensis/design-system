import { raw } from "hono/html";
import type { PropsWithChildren } from "hono/jsx";
import { site } from "./site.ts";
import styleUrl from "./style.css?url";

const navItems = [
	{ href: "/", label: "概要" },
	{ href: "/tokens", label: "トークン" },
	{ href: "/components", label: "コンポーネント" },
	{ href: "/prose", label: "記事スタイル" },
];

type LayoutProps = PropsWithChildren<{
	title: string;
	/** 省略するとサイト全体の説明を使います。 */
	description?: string;
	/** リクエストの URL（c.req.url）。canonical と OGP の絶対 URL に使います。 */
	url: string;
}>;

export function Layout({
	title,
	description = site.description,
	url,
	children,
}: LayoutProps) {
	/* デプロイ先のドメインを決め打ちせず、リクエストの URL から組み立てます。
	   クエリ文字列は canonical に含めません。 */
	const { origin, pathname } = new URL(url);
	const canonicalUrl = new URL(pathname, origin).toString();
	const ogImageUrl = new URL(site.ogImage.path, origin).toString();
	const pageTitle = `${title} | ${site.name}`;

	return (
		<>
			{raw("<!doctype html>")}
			<html lang="ja">
				<head>
					<meta charset="utf-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<title>{pageTitle}</title>
					<meta name="description" content={description} />
					<link rel="canonical" href={canonicalUrl} />

					<meta property="og:type" content="website" />
					<meta property="og:site_name" content={site.name} />
					<meta property="og:title" content={pageTitle} />
					<meta property="og:description" content={description} />
					<meta property="og:url" content={canonicalUrl} />
					<meta property="og:image" content={ogImageUrl} />
					<meta
						property="og:image:width"
						content={String(site.ogImage.width)}
					/>
					<meta
						property="og:image:height"
						content={String(site.ogImage.height)}
					/>
					<meta property="og:locale" content="ja_JP" />
					<meta name="twitter:card" content="summary_large_image" />

					<link rel="icon" type="image/svg+xml" href={site.favicon} />
					<link rel="apple-touch-icon" href={site.appleTouchIcon} />

					<link rel="stylesheet" href={styleUrl} />
				</head>
				<body>
					<div class="mx-auto flex max-w-3xl flex-col gap-10 px-6 py-12">
						<header class="flex flex-col gap-4 border-border border-b pb-6">
							<a href="/" class="font-bold text-lg">
								{site.name}
							</a>
							<nav class="flex flex-wrap gap-4 text-sm">
								{navItems.map((item) => (
									<a
										key={item.href}
										href={item.href}
										class="text-fg-muted underline-offset-4 hover:underline"
									>
										{item.label}
									</a>
								))}
							</nav>
						</header>
						<main class="flex flex-col gap-10">{children}</main>
					</div>
				</body>
			</html>
		</>
	);
}
