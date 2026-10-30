import { cn } from "../lib/utils.ts";
import styles from "./icon.module.css";
import { Icon, type IconProps } from "./icon.tsx";

export function CheckIcon({ class: className, ...props }: IconProps) {
	return (
		<Icon viewBox="0 0 24 24" class={cn(styles.size, className)} {...props}>
			<path d="M20 6 9 17l-5-5" />
		</Icon>
	);
}
