import { cn } from "../../lib/utils.ts";

/* サイトのロゴマーク。大きさは h-* / w-* のクラスで、色は currentColor 経由で
   親要素の color を継承します。 */
type LogoIconProps = {
	class?: string;
};

export function LogoIcon({ class: className }: LogoIconProps) {
	return (
		<svg
			data-slot="logo-icon"
			class={cn("h-6 w-auto", className)}
			viewBox="0 0 21 12"
			fill="none"
			aria-hidden="true"
		>
			<path
				d="M0.5 11.5C0.5 7 4 5.5 5.5 5.5C6 2.1 8.5 0.5 11 0.5C13.5 0.5 15.4 2 16.4 4.5C18.9 4.3 20.5 6 20.5 8C20.5 10 19 11.5 17 11.5C17 11.5 12.6667 11.5 11.5 11.5V7.5"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<circle cx="11.5" cy="7.5" r="1.5" fill="currentColor" />
		</svg>
	);
}
