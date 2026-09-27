import type { JSX } from "hono/jsx";
import { cn } from "../lib/utils.ts";

const variants = {
	variant: {
		default: cn(
			"bg-emphasis text-on-emphasis not-disabled:hover:bg-emphasis/90",
		),
		outline: cn("border-default not-disabled:hover:bg-emphasis/5"),
	},
	size: {
		default: cn("px-4 py-2"),
		sm: cn("px-3 py-1 text-sm"),
	},
};

type ButtonProps = JSX.IntrinsicElements["button"] & {
	class?: string;
	variant?: keyof typeof variants.variant;
	size?: keyof typeof variants.size;
};

export function Button({
	variant = "default",
	size = "default",
	class: className,
	children,
	...props
}: ButtonProps) {
	return (
		<button
			class={cn(
				"inline-block cursor-pointer rounded-sm border border-transparent disabled:cursor-not-allowed disabled:opacity-50",
				variants.variant[variant],
				variants.size[size],
				className,
			)}
			{...props}
		>
			{children}
		</button>
	);
}
