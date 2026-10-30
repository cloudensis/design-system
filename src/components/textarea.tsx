import type { JSX } from "hono/jsx";
import { cn } from "../lib/utils.ts";
import styles from "./textarea.module.css";

type TextareaProps = JSX.IntrinsicElements["textarea"] & {
	class?: string;
};

export function Textarea({
	class: className,
	children,
	...props
}: TextareaProps) {
	return (
		<textarea class={cn(styles.textarea, className)} {...props}>
			{children}
		</textarea>
	);
}
