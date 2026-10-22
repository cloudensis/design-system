import type { Child } from "hono/jsx";
import { cn } from "../lib/utils.ts";

export type IconProps = {
	class?: string;
	label?: string;
};

type IconBaseProps = IconProps & {
	viewBox: string;
	children: Child;
};

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
