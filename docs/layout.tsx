import { raw } from "hono/html";
import type { PropsWithChildren } from "hono/jsx";
import { Footer } from "../src/components/layout/footer.tsx";
import { Header } from "../src/components/layout/header.tsx";
import { cn } from "../src/lib/utils.ts";
import { site } from "./site.ts";
import styleUrl from "./style.css?url";

const components = [
	"Button",
	"LinkButton",
	"Input",
	"Select",
	"Textarea",
	"Tooltip",
	"CodeBlock",
	"DescriptionList",
	"Section",
	"Header",
	"Footer",
];

/* サイドバーのナビゲーション。コンポーネントは /components のセクションへの
   ページ内リンクです。 */
const navGroups = [
	{
		label: "Foundations",
		items: [
			{ href: "/", label: "Introduction" },
			{ href: "/tokens", label: "Tokens" },
			{ href: "/prose", label: "Prose" },
		],
	},
	{
		label: "Components",
		items: [
			{ href: "/components", label: "Overview" },
			...components.map((name) => ({
				href: `/components#${name.toLowerCase()}`,
				label: name,
			})),
		],
	},
];

type LayoutProps = PropsWithChildren<{
	title?: string;
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
	const pageTitle = title ? `${title} | ${site.name}` : site.name;

	return (
		<>
			{raw("<!doctype html>")}
			<html lang="ja" class="scroll-pt-16">
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
					<meta property="og:image" content={site.ogImage.url} />
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
					<link rel="apple-touch-icon" href={site.logo} />

					<link rel="stylesheet" href={styleUrl} />
				</head>
				<body class="min-h-svh">
					<Header
						title="cloudensis"
						class="sticky top-0 z-10 h-16 flex-nowrap border-border border-b bg-bg py-0"
					/>

					{/* 幅の狭い画面ではサイドバーの代わりにページ単位のリンクを横に並べます。 */}
					<nav class="flex gap-4 overflow-x-auto border-border border-b px-4 py-3 text-sm lg:hidden">
						{[...navGroups[0].items, navGroups[1].items[0]].map((item) => (
							<a
								key={item.href}
								href={item.href}
								class={cn(
									"shrink-0 text-fg-muted",
									item.href === pathname && "font-medium text-accent",
								)}
							>
								{item.href === "/components" ? "Components" : item.label}
							</a>
						))}
					</nav>

					<div class="flex">
						<aside class="sticky top-16 hidden h-[calc(100svh-4rem)] w-60 shrink-0 overflow-y-auto border-border border-r p-4 lg:block">
							<nav class="space-y-6 text-sm">
								{navGroups.map((group) => (
									<div key={group.label}>
										<p class="mb-2 px-2 font-medium text-accent">
											{group.label}
										</p>
										<ul>
											{group.items.map((item) => (
												<li key={item.href}>
													<a
														href={item.href}
														class={cn(
															"block rounded px-2 py-1.5 text-fg-muted hover:text-accent",
															item.href === pathname &&
																"bg-border/60 font-medium text-accent",
														)}
													>
														{item.label}
													</a>
												</li>
											))}
										</ul>
									</div>
								))}
							</nav>
						</aside>

						<div class="flex min-h-[calc(100svh-4rem)] min-w-0 flex-1 flex-col">
							<main class="flex-1">
								<div class="border-border border-b px-6 py-12 lg:px-12">
									<h1 class="font-medium text-3xl text-accent lg:text-4xl">
										{title ?? site.name}
									</h1>
									<p class="mt-3 text-fg-muted text-lg">{description}</p>
								</div>
								<div class="divide-y divide-border *:px-6 *:py-10 lg:*:px-12">
									{children}
								</div>
							</main>
							<Footer
								copyrightHolder="cloudensis"
								class="border-border border-t"
							/>
						</div>
					</div>
				</body>
			</html>
		</>
	);
}
