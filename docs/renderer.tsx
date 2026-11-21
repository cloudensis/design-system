import { jsxRenderer, useRequestContext } from "hono/jsx-renderer";
import { Link, Script, ViteClient } from "vite-ssr-components/hono";
import { LogoLockup } from "../src/brand/cloudensis/logo-lockup.tsx";
import { Button } from "../src/components/button.tsx";
import { MenuIcon } from "../src/icons/menu.tsx";
import { XIcon } from "../src/icons/x.tsx";
import styles from "./layout.module.css";
import { moduleStyles } from "./module-styles.ts";
import { SideNav } from "./side-nav.tsx";

export const siteName = "cloudensis design system";
/* 静的に書き出すため、リクエストの URL ではなく本番の URL から OGP 画像の URL を作る。 */
const siteUrl = "https://design-system.cloudensis.com";

export type Meta = {
	/** ページの見出し。title 要素ではサイト名を後ろに付ける。 */
	title: string;
	description: string;
	noindex?: boolean;
};

type Render = (content: string | Promise<string>, meta: Meta) => Response;

declare module "hono" {
	interface ContextRenderer extends Render {}
}

export const renderer = jsxRenderer(
	({ children, title, description, noindex }) => {
		const current = useRequestContext().req.path;
		const fullTitle = title === siteName ? siteName : `${title} | ${siteName}`;
		const ogImageUrl = new URL("/ogp.png", siteUrl).toString();

		return (
			<html lang="ja">
				<head>
					<meta charset="utf-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<title>{fullTitle}</title>
					<meta name="description" content={description} />
					<meta property="og:type" content="website" />
					<meta property="og:title" content={fullTitle} />
					<meta property="og:description" content={description} />
					<meta property="og:image" content={ogImageUrl} />
					<meta property="og:image:width" content="1200" />
					<meta property="og:image:height" content="630" />
					<meta name="twitter:card" content="summary_large_image" />
					{noindex && <meta name="robots" content="noindex, nofollow" />}
					<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
					<link rel="apple-touch-icon" href="/logo.png" />
					<Link href="/docs/style.css" rel="stylesheet" />
					<style dangerouslySetInnerHTML={{ __html: moduleStyles }} />
					<ViteClient />
					<Script src="/docs/client.ts" />
				</head>
				<body>
					<header class={styles.header}>
						<Button
							type="button"
							variant="outline"
							size="icon"
							popovertarget="mobile-nav"
							aria-label="メニュー"
							class={styles.menuButton}
						>
							<MenuIcon />
						</Button>
						<a href="/" class={styles.home}>
							<LogoLockup class={styles.logo} />
							<span class={styles.homeLabel}>design system</span>
						</a>
					</header>

					<div id="mobile-nav" popover="auto" class={styles.mobileNav}>
						<header class={styles.mobileNavHeader}>
							<Button
								type="button"
								variant="outline"
								size="icon"
								popovertarget="mobile-nav"
								popovertargetaction="hide"
								aria-label="閉じる"
							>
								<XIcon />
							</Button>
						</header>
						<div class={styles.mobileNavBody}>
							<SideNav current={current} />
						</div>
					</div>

					<div class={styles.body}>
						<aside class={styles.sideNav}>
							<SideNav current={current} />
						</aside>
						<main class={styles.main}>
							<div class={styles.content}>
								<h1 class={styles.title}>{title}</h1>
								{children}
							</div>
						</main>
					</div>
				</body>
			</html>
		);
	},
);
