import { cn } from "../lib/utils.ts";
import { Icon, type IconProps } from "./icon.tsx";

export function XIcon({ class: className, ...props }: IconProps) {
	return (
		<Icon viewBox="0 0 24 24" class={cn("size-4", className)} {...props}>
			<path d="M18 6 6 18" />
			<path d="m6 6 12 12" />
		</Icon>
	);
}
