import { Hono } from "hono";
import { jsxRenderer, useRequestContext } from "hono/jsx-renderer";
import { LogoLockup } from "../src/brand/cloudensis/logo-lockup.tsx";
import { Button } from "../src/components/button.tsx";
import { MenuIcon } from "../src/icons/menu.tsx";
import { XIcon } from "../src/icons/x.tsx";
import styles from "./layout.module.css";
import { moduleStyles } from "./module-styles.ts";
import { nav } from "./nav.ts";
import { Template as AssetsTemplate } from "./routes/assets/template.tsx";
import { Template as CloudensisTemplate } from "./routes/brand/cloudensis/template.tsx";
import { Template as ButtonTemplate } from "./routes/components/button/template.tsx";
import { Template as CodeBlockTemplate } from "./routes/components/code-block/template.tsx";
import { Template as InputTemplate } from "./routes/components/input/template.tsx";
import { Template as SelectTemplate } from "./routes/components/select/template.tsx";
import { Template as TextareaTemplate } from "./routes/components/textarea/template.tsx";
import { Template as IconsTemplate } from "./routes/icons/template.tsx";
import { Template as ColorsTemplate } from "./routes/styles/colors/template.tsx";
import { Template as ProseTemplate } from "./routes/styles/prose/template.tsx";
import { Template as TypographyTemplate } from "./routes/styles/typography/template.tsx";
import { Template as HomeTemplate } from "./routes/template.tsx";
import { SideNav } from "./side-nav.tsx";
import styleUrl from "./style.css?url";

const siteName = "cloudensis design system";
/* 静的に書き出すため、リクエストの URL ではなく本番の URL から OGP 画像の URL を作る。 */
const siteUrl = "https://design-system.cloudensis.com";

const renderer = jsxRenderer(({ children }) => {
	const c = useRequestContext();
	const current = c.req.path;
	const page = nav
		.flatMap((group) => group.items)
		.find((item) => item.href === current);
	const heading = current === "/" || !page ? siteName : page.label;
	const title = heading === siteName ? siteName : `${heading} | ${siteName}`;
	const ogImageUrl = new URL("/ogp.png", siteUrl).toString();

	return (
		<html lang="ja">
			<head>
				<meta charset="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<title>{title}</title>
				<meta property="og:type" content="website" />
				<meta property="og:title" content={title} />
				<meta property="og:image" content={ogImageUrl} />
				<meta property="og:image:width" content="1200" />
				<meta property="og:image:height" content="630" />
				<meta name="twitter:card" content="summary_large_image" />
				<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
				<link rel="apple-touch-icon" href="/logo.png" />
				<link rel="stylesheet" href={styleUrl} />
				<style dangerouslySetInnerHTML={{ __html: moduleStyles }} />
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
							<h1 class={styles.title}>{heading}</h1>
							{children}
						</div>
					</main>
				</div>
			</body>
		</html>
	);
});

const app = new Hono();

app.use(renderer);

app.get("/", (c) => c.render(<HomeTemplate />));
app.get("/styles/colors", (c) => c.render(<ColorsTemplate />));
app.get("/styles/typography", (c) => c.render(<TypographyTemplate />));
app.get("/styles/prose", (c) => c.render(<ProseTemplate />));
app.get("/components/button", (c) => c.render(<ButtonTemplate />));
app.get("/components/code-block", (c) => c.render(<CodeBlockTemplate />));
app.get("/components/input", (c) => c.render(<InputTemplate />));
app.get("/components/select", (c) => c.render(<SelectTemplate />));
app.get("/components/textarea", (c) => c.render(<TextareaTemplate />));
app.get("/icons", (c) => c.render(<IconsTemplate />));
app.get("/brand/cloudensis", (c) => c.render(<CloudensisTemplate />));
app.get("/assets", (c) => c.render(<AssetsTemplate />));

export default app;
