import type { JSX } from "hono/jsx";
import { cn } from "../../lib/utils.ts";

const variants = {
	variant: {
		default: cn("w-full rounded border border-neutral-800 px-4 py-2"),
	},
};

type SelectProps = JSX.IntrinsicElements["select"] & {
	class?: string;
	variant?: keyof typeof variants.variant;
};

export function Select({
	variant = "default",
	class: className,
	children,
	...props
}: SelectProps) {
	return (
		<select
			data-slot="select"
			class={cn(variants.variant[variant], className)}
			{...props}
		>
			{children}
		</select>
	);
}
