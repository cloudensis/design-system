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
		/** true にすると href を外し、クリックでもキーボードでも遷移しないようにする。 */
		disabled?: boolean;
	};

export function LinkButton({
	variant = "default",
	size = "default",
	class: className,
	disabled = false,
	href,
	"aria-disabled": ariaDisabled,
	children,
	...props
}: LinkButtonProps) {
	/* 従来の aria-disabled="true" だけの指定も、無効として扱う。 */
	const isDisabled =
		disabled || ariaDisabled === true || ariaDisabled === "true";
	/* href のない a は link の role を失うため、role を付け直す。 */
	const stateProps = isDisabled
		? { role: "link", "aria-disabled": "true" as const }
		: { href, "aria-disabled": ariaDisabled };

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
			{...stateProps}
		>
			{children}
		</a>
	);
}
