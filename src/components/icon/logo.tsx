import { cn } from "../../lib/utils.ts";

type LogoIconProps = {
	class?: string;
};

export function LogoIcon({ class: className }: LogoIconProps) {
	return (
		<svg
			data-slot="logo-icon"
			class={cn("h-6 w-auto", className)}
			viewBox="0 0 42 24"
			fill="none"
			aria-hidden="true"
		>
			<title>logo</title>
			<path
				d="M1 23C1 14 8 11 11 11C12 4.2 17 1 22 1C27 1 30.8 4 32.8 9C37.8 8.6 41 12 41 16C41 20 38 23 34 23C34 23 25.3334 23 23 23V15"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<circle cx="23" cy="15" r="3" fill="currentColor" />
		</svg>
	);
}
