import type { JSX } from "hono/jsx";
import { cn } from "../../lib/utils.ts";

const variants = {
	variant: {
		default: cn(
			"inline-block cursor-pointer rounded bg-neutral-800 text-white hover:bg-neutral-700",
		),
	},
	size: {
		default: cn("px-4 py-2"),
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
			data-slot="button"
			class={cn(variants.variant[variant], variants.size[size], className)}
			{...props}
		>
			{children}
		</button>
	);
}

type LinkButtonProps = JSX.IntrinsicElements["a"] & {
	class?: string;
	variant?: keyof typeof variants.variant;
	size?: keyof typeof variants.size;
};

export function LinkButton({
	variant = "default",
	size = "default",
	class: className,
	children,
	...props
}: LinkButtonProps) {
	return (
		<a
			data-slot="link-button"
			class={cn(variants.variant[variant], variants.size[size], className)}
			{...props}
		>
			{children}
		</a>
	);
}
