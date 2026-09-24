import type { JSX } from "hono/jsx";
import { cn } from "../lib/utils.ts";

type ButtonProps = JSX.IntrinsicElements["button"] & {
	class?: string;
};

export function Button({ class: className, children, ...props }: ButtonProps) {
	return (
		<button
			data-slot="button"
			class={cn(
				"inline-block cursor-pointer rounded-sm bg-accent px-4 py-2 text-accent-fg not-disabled:hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50",
				className,
			)}
			{...props}
		>
			{children}
		</button>
	);
}
