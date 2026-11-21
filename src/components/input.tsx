import type { JSX } from "hono/jsx";
import { cn } from "../lib/utils.ts";

type InputProps = JSX.IntrinsicElements["input"] & {
	class?: string;
};

export function Input({ type, class: className, ...props }: InputProps) {
	/* 無効時はブラウザ標準で薄くなるため、opacity は重ねない。 */
	if (type === "checkbox" || type === "radio") {
		return (
			<input
				type={type}
				class={cn(
					"accent-checked size-4 disabled:cursor-not-allowed",
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
				"border-emphasis placeholder:text-muted disabled:text-disabled disabled:placeholder:text-disabled aria-invalid:border-danger-emphasis h-10 w-full rounded-sm border px-4 disabled:cursor-not-allowed",
				className,
			)}
			{...props}
		/>
	);
}
