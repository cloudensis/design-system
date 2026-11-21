import type { JSX } from "hono/jsx";
import { cn } from "../lib/utils.ts";
import styles from "./input.module.css";

type InputProps = JSX.IntrinsicElements["input"] & {
	class?: string;
};

export function Input({ type, class: className, ...props }: InputProps) {
	const isChoice = type === "checkbox" || type === "radio";

	return (
		<input
			type={type}
			class={cn(isChoice ? styles.choice : styles.input, className)}
			{...props}
		/>
	);
}
