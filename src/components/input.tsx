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
					"size-4 accent-(--background-color-emphasis) disabled:cursor-not-allowed",
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
				"h-10 w-full rounded-sm border border-default px-4 disabled:cursor-not-allowed disabled:text-default/50",
				className,
			)}
			{...props}
		/>
	);
}
