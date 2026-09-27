import { cn } from "../lib/utils.ts";

type LogoTypeProps = {
	class?: string;
};

export function LogoType({ class: className }: LogoTypeProps) {
	return (
		<span class={cn("font-extralight tracking-wider", className)}>
			cloudensis
		</span>
	);
}
