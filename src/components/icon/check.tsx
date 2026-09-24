import { cn } from "../../lib/utils.ts";

type CheckIconProps = {
	class?: string;
};

export function CheckIcon({ class: className }: CheckIconProps) {
	return (
		<svg
			data-slot="check-icon"
			class={cn("size-4", className)}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<path d="M20 6 9 17l-5-5" />
		</svg>
	);
}
