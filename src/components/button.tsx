import type { JSX } from "hono/jsx";
import { cn } from "../lib/utils.ts";

const variants = {
	default: cn("bg-emphasis text-on-emphasis not-disabled:hover:bg-emphasis/90"),
	outline: cn("border-default not-disabled:hover:bg-emphasis/5"),
};

type ButtonProps = JSX.IntrinsicElements["button"] & {
	class?: string;
	variant?: keyof typeof variants;
};

export function Button({
	variant = "default",
	class: className,
	children,
	...props
}: ButtonProps) {
	return (
		<button
			class={cn(
				"inline-block cursor-pointer rounded-sm border border-transparent px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50",
				variants[variant],
				className,
			)}
			{...props}
		>
			{children}
		</button>
	);
}
