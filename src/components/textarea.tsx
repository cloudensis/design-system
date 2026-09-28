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
				"w-full rounded-sm border border-default px-4 py-2 disabled:cursor-not-allowed disabled:text-default/50",
				className,
			)}
			{...props}
		>
			{children}
		</textarea>
	);
}
