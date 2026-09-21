import type { JSX } from "hono/jsx";
import { cn } from "../../lib/utils.ts";

const variants = {
	variant: {
		default: cn(
			"overflow-x-auto rounded border border-border bg-surface p-4 text-sm",
		),
	},
};

type CodeBlockProps = JSX.IntrinsicElements["pre"] & {
	class?: string;
	variant?: keyof typeof variants.variant;
};

export function CodeBlock({
	variant = "default",
	class: className,
	children,
	...props
}: CodeBlockProps) {
	return (
		<pre
			data-slot="code-block"
			class={cn(variants.variant[variant], className)}
			{...props}
		>
			<code>{children}</code>
		</pre>
	);
}
