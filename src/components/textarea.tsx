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
	/* placeholder の文字も背景とのコントラストを 4.5:1 以上にするため、current から薄めすぎない。 */
	return (
		<textarea
			class={cn(
				"w-full rounded-sm border border-default px-4 py-2 placeholder:text-current/85 disabled:cursor-not-allowed disabled:text-default/50 aria-invalid:border-danger",
				className,
			)}
			{...props}
		>
			{children}
		</textarea>
	);
}
