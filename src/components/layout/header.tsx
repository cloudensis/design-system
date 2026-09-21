import type { Child } from "hono/jsx";
import { cn } from "../../lib/utils.ts";
import { LogoIcon } from "../icon/logo.tsx";

type HeaderProps = {
	class?: string;
	/** ロゴ／ブランド名をクリックした際の遷移先。 */
	homeHref?: string;
	/** ブランド名の左に置くロゴ。省略すると LogoIcon になります。 */
	logo?: Child;
	/** ブランド名。 */
	brand: Child;
	/** 右側に置くナビゲーションやボタンなど。 */
	children?: Child;
};

/**
 * サイト共通のヘッダー。ロゴ + ブランド名を左、children を右に並べます。
 */
export function Header({
	class: className,
	homeHref = "/",
	logo = <LogoIcon />,
	brand,
	children,
}: HeaderProps) {
	return (
		<header
			data-slot="header"
			class={cn("flex items-center justify-between p-4 lg:px-8", className)}
		>
			<a href={homeHref} class="flex items-baseline gap-3 text-accent">
				{logo}
				<span class="font-extralight text-3xl tracking-wider">{brand}</span>
			</a>
			{children}
		</header>
	);
}
