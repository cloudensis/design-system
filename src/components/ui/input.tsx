import type { JSX } from "hono/jsx";
import { cn } from "../../lib/utils.ts";

const variants = {
	variant: {
		default: cn("w-full rounded border border-neutral-800 px-4 py-2"),
	},
};

type InputProps = JSX.IntrinsicElements["input"] & {
	class?: string;
	variant?: keyof typeof variants.variant;
};

export function Input({
	variant = "default",
	type,
	class: className,
	...props
}: InputProps) {
	if (type === "checkbox") return <Checkbox class={className} {...props} />;
	if (type === "radio") return <Radio class={className} {...props} />;

	return (
		<input
			data-slot="input"
			type={type}
			class={cn(variants.variant[variant], className)}
			{...props}
		/>
	);
}

type CheckProps = JSX.IntrinsicElements["input"] & {
	class?: string;
	type?: never;
};

function Checkbox({ class: className, ...props }: CheckProps) {
	return (
		<input
			data-slot="checkbox"
			type="checkbox"
			class={cn("size-4", className)}
			{...props}
		/>
	);
}

type RadioProps = JSX.IntrinsicElements["input"] & {
	class?: string;
	type?: never;
};

function Radio({ class: className, ...props }: RadioProps) {
	return <input data-slot="radio" type="radio" class={className} {...props} />;
}
