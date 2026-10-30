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
				"border-emphasis placeholder:text-muted disabled:text-disabled disabled:placeholder:text-disabled aria-invalid:border-danger-emphasis w-full rounded-sm border px-4 py-2 disabled:cursor-not-allowed",
				className,
			)}
			{...props}
		>
			{children}
		</textarea>
	);
}
