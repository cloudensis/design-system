import type { JSX } from "hono/jsx";
import { cn } from "../../lib/utils.ts";

const variants = {
	variant: {
		default: cn(
			"w-full rounded-sm border border-border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger",
		),
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
