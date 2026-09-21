import type { Child } from "hono/jsx";
import { cn } from "../../lib/utils.ts";

type FooterLink = {
	href: string;
	label: Child;
	/** true で新しいタブで開きます（target="_blank" rel="noopener noreferrer"）。 */
	external?: boolean;
};

type FooterProps = {
	class?: string;
	/** コピーライト表記に使う名称（会社名など）。 */
	copyrightHolder: Child;
	/** コピーライト表記の年。省略すると現在の年になります。 */
	year?: number;
	/** 右側に並べるリンク。 */
	links?: FooterLink[];
	/** リンクの代わりに任意の内容を右側に置きたい場合に使います。 */
	children?: Child;
};

/**
 * サイト共通のフッター。コピーライト表記を左、リンク（または children）を右に並べます。
 */
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
				"flex items-center justify-between px-4 py-8 text-sm lg:px-8",
				className,
			)}
		>
			<span>
				&copy; {year} {copyrightHolder}
			</span>
			{children ??
				(links.length > 0 && (
					<nav class="flex gap-4">
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
