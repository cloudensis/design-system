import { cn } from "../lib/utils.ts";
import { Icon, type IconProps } from "./icon.tsx";

export function MenuIcon({ class: className, ...props }: IconProps) {
	return (
		<Icon viewBox="0 0 24 24" class={cn("size-4", className)} {...props}>
			<path d="M4 5h16" />
			<path d="M4 12h16" />
			<path d="M4 19h16" />
		</Icon>
	);
}
