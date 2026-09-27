import type { JSX } from "hono/jsx";
import { cn } from "../lib/utils.ts";

const variants = {
	/* <a> は :enabled に一致しないため、hover は not-disabled で書く。 */
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

type Variants = {
	variant?: keyof typeof variants.variant;
	size?: keyof typeof variants.size;
};

const base = "inline-block cursor-pointer rounded-sm border border-transparent";

type ButtonProps = JSX.IntrinsicElements["button"] &
	Variants & {
		class?: string;
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
				base,
				"disabled:cursor-not-allowed disabled:opacity-50",
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

type LinkButtonProps = JSX.IntrinsicElements["a"] &
	Variants & {
		class?: string;
	};

/** 無効にするときは href を外し、aria-disabled="true" を付ける。 */
export function LinkButton({
	variant = "default",
	size = "default",
	class: className,
	children,
	...props
}: LinkButtonProps) {
	return (
		<a
			class={cn(
				base,
				"not-prose aria-disabled:pointer-events-none aria-disabled:opacity-50",
				variants.variant[variant],
				variants.size[size],
				className,
			)}
			{...props}
		>
			{children}
		</a>
	);
}
