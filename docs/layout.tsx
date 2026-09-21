import { raw } from "hono/html";
import type { PropsWithChildren } from "hono/jsx";
import styleUrl from "./style.css?url";

const navItems = [
	{ href: "/", label: "概要" },
	{ href: "/tokens", label: "トークン" },
	{ href: "/components", label: "コンポーネント" },
	{ href: "/prose", label: "記事スタイル" },
];

type LayoutProps = PropsWithChildren<{ title: string }>;

export function Layout({ title, children }: LayoutProps) {
	return (
		<>
			{raw("<!doctype html>")}
			<html lang="ja">
				<head>
					<meta charset="utf-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<title>{title} | Cloudensis Design System</title>
					<link rel="stylesheet" href={styleUrl} />
				</head>
				<body>
					<div class="mx-auto flex max-w-3xl flex-col gap-10 px-6 py-12">
						<header class="flex flex-col gap-4 border-border border-b pb-6">
							<a href="/" class="font-bold text-lg">
								Cloudensis Design System
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
