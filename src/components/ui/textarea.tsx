import type { JSX } from "hono/jsx";
import { cn } from "../../lib/utils.ts";

const variants = {
	variant: {
		default: cn(
			"w-full rounded-sm border border-border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger",
		),
	},
};

type TextareaProps = JSX.IntrinsicElements["textarea"] & {
	class?: string;
	variant?: keyof typeof variants.variant;
};

export function Textarea({
	variant = "default",
	class: className,
	children,
	...props
}: TextareaProps) {
	return (
		<textarea
			data-slot="textarea"
			class={cn(variants.variant[variant], className)}
			{...props}
		>
			{children}
		</textarea>
	);
}
