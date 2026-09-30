import { Hono } from "hono";
import { jsxRenderer, useRequestContext } from "hono/jsx-renderer";
import { LogoLockup } from "../src/brand/cloudensis/logo-lockup.tsx";
import { Button } from "../src/components/button.tsx";
import { MenuIcon } from "../src/icons/menu.tsx";
import { XIcon } from "../src/icons/x.tsx";
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

const renderer = jsxRenderer(({ children }) => {
	const c = useRequestContext();
	const current = c.req.path;
	const page = nav
		.flatMap((group) => group.items)
		.find((item) => item.href === current);
	const heading = current === "/" || !page ? siteName : page.label;
	const title = heading === siteName ? siteName : `${heading} | ${siteName}`;
	const ogImageUrl = new URL("/ogp.png", c.req.url).toString();

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
			</head>
			<body>
				<header class="sticky top-0 z-10 flex h-14 items-center gap-4 border-default border-b bg-default px-4 lg:px-6">
					<Button
						type="button"
						variant="outline"
						size="sm"
						popovertarget="mobile-nav"
						aria-label="メニュー"
						class="size-8 px-0 lg:hidden"
					>
						<MenuIcon />
					</Button>
					<a href="/" class="flex items-baseline gap-2">
						<LogoLockup class="text-lg" />
						<span class="text-sm">design system</span>
					</a>
				</header>

				<div
					id="mobile-nav"
					popover="auto"
					class="inset-y-0 right-auto left-0 m-0 h-svh w-72 max-w-[80vw] flex-col border-default border-r bg-default p-0 text-default backdrop:bg-black/30 open:flex"
				>
					{/* 開閉ボタンの位置をそろえるため、ページの header と同じ高さと余白にする。 */}
					<header class="flex h-14 shrink-0 items-center border-default border-b px-4">
						<Button
							type="button"
							variant="outline"
							size="sm"
							popovertarget="mobile-nav"
							popovertargetaction="hide"
							aria-label="閉じる"
							class="size-8 px-0"
						>
							<XIcon />
						</Button>
					</header>
					<div class="min-h-0 flex-1 overflow-y-auto p-4">
						<SideNav current={current} />
					</div>
				</div>

				<div class="flex">
					<aside class="sticky top-14 hidden h-[calc(100svh-3.5rem)] w-60 shrink-0 overflow-y-auto border-default border-r p-4 lg:block">
						<SideNav current={current} />
					</aside>
					<main class="min-w-0 flex-1 px-6 py-10 lg:px-12">
						<div class="mx-auto max-w-3xl space-y-8">
							<h1 class="text-heading-1">{heading}</h1>
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
