import type { JSX } from "hono/jsx";
import { cn } from "../lib/utils.ts";
import styles from "./button.module.css";

const variants = {
	variant: {
		default: styles.variantDefault,
		outline: styles.variantOutline,
	},
	size: {
		default: styles.sizeDefault,
		sm: styles.sizeSm,
		icon: styles.sizeIcon,
	},
};

type Variants = {
	variant?: keyof typeof variants.variant;
	size?: keyof typeof variants.size;
};

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
				styles.button,
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
				"not-prose",
				styles.button,
				styles.link,
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
