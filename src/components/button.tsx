import type { JSX } from "hono/jsx";
import { cn } from "../lib/utils.ts";

const variants = {
	/*
	 * <a> は :enabled に一致しないため、hover は not-disabled で書く。
	 * 無効のときは枠線を残すため、opacity ではなく背景や文字だけを薄くする。
	 */
	variant: {
		default: cn(
			"bg-emphasis text-on-emphasis not-disabled:hover:bg-emphasis/90 disabled:bg-emphasis/50 aria-disabled:bg-emphasis/50",
		),
		outline: cn(
			"border-default not-disabled:hover:bg-emphasis/5 disabled:text-default/50 aria-disabled:text-default/50",
		),
	},
	size: {
		default: cn("h-10 px-4"),
		sm: cn("h-8 px-3 text-sm"),
		icon: cn("size-8"),
	},
};

type Variants = {
	variant?: keyof typeof variants.variant;
	size?: keyof typeof variants.size;
};

/* <a> でも文字が縦の中央に来るよう、inline-flex にする。 */
const base =
	"inline-flex cursor-pointer items-center justify-center rounded-sm border border-transparent";

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
				"disabled:cursor-not-allowed",
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
				"not-prose aria-disabled:pointer-events-none",
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
