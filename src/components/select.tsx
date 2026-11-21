import type { JSX } from "hono/jsx";
import { cn } from "../lib/utils.ts";

type SelectProps = JSX.IntrinsicElements["select"] & {
	class?: string;
};

export function Select({ class: className, children, ...props }: SelectProps) {
	return (
		<select
			class={cn(
				"border-emphasis disabled:text-disabled aria-invalid:border-danger-emphasis h-10 w-full rounded-sm border px-4 disabled:cursor-not-allowed",
				className,
			)}
			{...props}
		>
			{children}
		</select>
	);
}
