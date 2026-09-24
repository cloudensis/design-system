import type { Child } from "hono/jsx";
import { cn } from "../../lib/utils.ts";

const variants = {
	placement: {
		top: cn("bottom-full left-1/2 mb-1.5 -translate-x-1/2"),
		bottom: cn("top-full left-1/2 mt-1.5 -translate-x-1/2"),
	},
};

type TooltipProps = {
	class?: string;
	label: Child;
	placement?: keyof typeof variants.placement;
	children: Child;
};

export function Tooltip({
	label,
	placement = "top",
	class: className,
	children,
}: TooltipProps) {
	return (
		<div
			data-slot="tooltip"
			class={cn("group/tooltip relative inline-flex", className)}
		>
			{children}
			<span
				data-slot="tooltip-label"
				role="tooltip"
				class={cn(
					"pointer-events-none absolute z-10 flex items-center gap-1 whitespace-nowrap rounded-sm bg-accent px-2 py-1 text-accent-fg text-xs opacity-0 transition-opacity group-focus-within/tooltip:opacity-100 group-hover/tooltip:opacity-100",
					variants.placement[placement],
				)}
			>
				{label}
			</span>
		</div>
	);
}
