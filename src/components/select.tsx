import type { JSX } from "hono/jsx";
import { cn } from "../lib/utils.ts";

type SelectProps = JSX.IntrinsicElements["select"] & {
	class?: string;
};

export function Select({ class: className, children, ...props }: SelectProps) {
	return (
		<select
			class={cn(
				"h-10 w-full rounded-sm border border-emphasis px-4 disabled:cursor-not-allowed disabled:text-disabled aria-invalid:border-danger-emphasis",
				className,
			)}
			{...props}
		>
			{children}
		</select>
	);
}
