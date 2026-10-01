import type { JSX } from "hono/jsx";
import { cn } from "../lib/utils.ts";

type TextareaProps = JSX.IntrinsicElements["textarea"] & {
	class?: string;
};

export function Textarea({
	class: className,
	children,
	...props
}: TextareaProps) {
	return (
		<textarea
			class={cn(
				"w-full rounded-sm border border-emphasis px-4 py-2 placeholder:text-muted disabled:cursor-not-allowed disabled:text-disabled disabled:placeholder:text-disabled aria-invalid:border-danger-emphasis",
				className,
			)}
			{...props}
		>
			{children}
		</textarea>
	);
}
