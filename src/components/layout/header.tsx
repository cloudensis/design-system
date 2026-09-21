import type { Child } from "hono/jsx";
import { cn } from "../../lib/utils.ts";
import { LogoIcon } from "../icon/logo.tsx";

type HeaderProps = {
	class?: string;
	/** ロゴ／ブランド名をクリックした際の遷移先。 */
	homeHref?: string;
	/** ブランド名。 */
	title: Child;
	/** 右側に置くナビゲーションやボタンなど。 */
	children?: Child;
};

/**
 * サイト共通のヘッダー。ロゴ + ブランド名を左、children を右に並べます。
 */
export function Header({
	class: className,
	homeHref = "/",
	title,
	children,
}: HeaderProps) {
	return (
		<header
			data-slot="header"
			class={cn("flex items-center justify-between p-4 lg:px-8", className)}
		>
			<a href={homeHref} class="flex items-baseline gap-2 text-accent lg:gap-3">
				<LogoIcon class="h-4 lg:h-6" />
				<span class="font-extralight text-xl tracking-wider lg:text-3xl">
					{title}
				</span>
			</a>
			{children}
		</header>
	);
}
