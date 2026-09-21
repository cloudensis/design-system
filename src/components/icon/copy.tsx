import { cn } from "../../lib/utils.ts";

/* アイコンは装飾なので、読み上げの対象から外して class だけを受け取ります。
   大きさは size-* のクラスで調整してください。 */
type CopyIconProps = {
	class?: string;
};

export function CopyIcon({ class: className }: CopyIconProps) {
	return (
		<svg
			data-slot="copy-icon"
			class={cn("size-4", className)}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<rect x="8" y="8" width="14" height="14" rx="2" />
			<path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
		</svg>
	);
}
