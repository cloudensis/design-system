import type { JSX } from "hono/jsx";
import { cn } from "../lib/utils.ts";
import styles from "./select.module.css";

type SelectProps = JSX.IntrinsicElements["select"] & {
	class?: string;
};

export function Select({ class: className, children, ...props }: SelectProps) {
	return (
		<select class={cn(styles.select, className)} {...props}>
			{children}
		</select>
	);
}
