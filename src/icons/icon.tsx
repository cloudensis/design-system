import type { Child } from "hono/jsx";
import { cn } from "../lib/utils.ts";

export type IconProps = {
	class?: string;
	/** 指定すると読み上げられる。省略すると装飾として扱い、読み上げない。 */
	label?: string;
};

type IconBaseProps = IconProps & {
	viewBox: string;
	children: Child;
};

/** アイコン共通の外枠。線と塗りは currentColor で、文字色に従う。大きさは各アイコンが決める。 */
export function Icon({ class: className, label, viewBox, children }: IconBaseProps) {
	return (
		<svg
			class={cn("shrink-0", className)}
			viewBox={viewBox}
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			role={label ? "img" : undefined}
			aria-label={label}
			aria-hidden={label ? undefined : "true"}
		>
			{children}
		</svg>
	);
}
