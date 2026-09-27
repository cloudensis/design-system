import type { JSX } from "hono/jsx";
import { cn } from "../lib/utils.ts";

type SelectProps = JSX.IntrinsicElements["select"] & {
	class?: string;
};

export function Select({ class: className, children, ...props }: SelectProps) {
	return (
		<select
			class={cn(
				"w-full rounded-sm border border-default px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50",
				className,
			)}
			{...props}
		>
			{children}
		</select>
	);
}
