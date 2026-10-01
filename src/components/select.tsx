import type { JSX } from "hono/jsx";
import { cn } from "../lib/utils.ts";

type SelectProps = JSX.IntrinsicElements["select"] & {
	class?: string;
};

export function Select({ class: className, children, ...props }: SelectProps) {
	return (
		<select
			class={cn(
				"h-10 w-full rounded-sm border border-default px-4 disabled:cursor-not-allowed disabled:text-default/50 aria-invalid:border-danger",
				className,
			)}
			{...props}
		>
			{children}
		</select>
	);
}
