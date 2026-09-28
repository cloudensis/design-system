import { cn } from "../lib/utils.ts";
import { Icon, type IconProps } from "./icon.tsx";

export function CopyIcon({ class: className, ...props }: IconProps) {
	return (
		<Icon viewBox="0 0 24 24" class={cn("size-4", className)} {...props}>
			<rect x="8" y="8" width="14" height="14" rx="2" />
			<path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
		</Icon>
	);
}
