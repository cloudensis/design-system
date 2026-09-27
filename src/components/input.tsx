import type { JSX } from "hono/jsx";
import { cn } from "../lib/utils.ts";

type InputProps = JSX.IntrinsicElements["input"] & {
	class?: string;
};

export function Input({ type, class: className, ...props }: InputProps) {
	if (type === "checkbox" || type === "radio") {
		return (
			<input
				type={type}
				class={cn(
					"size-4 accent-[var(--background-color-emphasis)] disabled:cursor-not-allowed disabled:opacity-50",
					className,
				)}
				{...props}
			/>
		);
	}

	return (
		<input
			type={type}
			class={cn(
				"w-full rounded-sm border border-default px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50",
				className,
			)}
			{...props}
		/>
	);
}
