import type { Child } from "hono/jsx";
import { cn } from "../../lib/utils.ts";

type FooterLink = {
	href: string;
	label: Child;
	/** 新しいタブで開く。 */
	external?: boolean;
};

type FooterProps = {
	class?: string;
	copyrightHolder: Child;
	/** 省略すると現在の年。 */
	year?: number;
	links?: FooterLink[];
	/** links の代わりに右側に置く内容。 */
	children?: Child;
};

export function Footer({
	class: className,
	copyrightHolder,
	year = new Date().getFullYear(),
	links = [],
	children,
}: FooterProps) {
	return (
		<footer
			data-slot="footer"
			class={cn(
				"flex flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm lg:px-8",
				className,
			)}
		>
			<span>
				&copy; {year} {copyrightHolder}
			</span>
			{children ??
				(links.length > 0 && (
					<nav class="flex flex-wrap gap-x-4 gap-y-2">
						{links.map((link) => (
							<a
								key={link.href}
								href={link.href}
								class="underline"
								target={link.external ? "_blank" : undefined}
								rel={link.external ? "noopener noreferrer" : undefined}
							>
								{link.label}
							</a>
						))}
					</nav>
				))}
		</footer>
	);
}
