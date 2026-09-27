import type { Child } from "hono/jsx";
import { cn } from "../lib/utils.ts";

export type IconProps = {
	class?: string;
	/** 省略すると装飾として扱う。 */
	label?: string;
};

type IconBaseProps = IconProps & {
	viewBox: string;
	children: Child;
};

/** 大きさは各アイコンで指定する。 */
export function Icon({
	class: className,
	label,
	viewBox,
	children,
}: IconBaseProps) {
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
