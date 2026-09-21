import type { Child } from "hono/jsx";
import { cn } from "../../lib/utils.ts";

type HeaderProps = {
	class?: string;
	/** ロゴ／ブランド名をクリックした際の遷移先。 */
	homeHref?: string;
	/** ブランド名の左に置くロゴ画像など。 */
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
	logo,
	brand,
	children,
}: HeaderProps) {
	return (
		<header
			data-slot="header"
			class={cn("flex items-center justify-between p-4 lg:px-8", className)}
		>
			<a href={homeHref} class="flex items-baseline gap-3">
				{logo}
				<span class="font-extralight text-3xl text-accent tracking-wider">
					{brand}
				</span>
			</a>
			{children}
		</header>
	);
}
