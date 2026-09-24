import type { Child } from "hono/jsx";
import { cn } from "../../lib/utils.ts";

const variants = {
	placement: {
		top: cn("bottom-full left-1/2 mb-1.5 -translate-x-1/2"),
		bottom: cn("top-full left-1/2 mt-1.5 -translate-x-1/2"),
	},
};

type TooltipProps = {
	class?: string;
	/** ホバー・フォーカス時に表示する内容。 */
	label: Child;
	placement?: keyof typeof variants.placement;
	children: Child;
};

/**
 * ホバー（とフォーカス）で補足を表示するツールチップ。開閉は CSS だけで行うため、
 * クライアント JavaScript を読み込まずに SSG・SSR・CSR のいずれでも動作します。
 *
 * ラベルは pointer-events-none なので、表示中でもクリックやホバーを遮りません。
 * キーボードから表示するには、中の要素がフォーカスを受け取れる必要があります
 * （tabindex を指定するなど）。
 */
export function Tooltip({
	label,
	placement = "top",
	class: className,
	children,
}: TooltipProps) {
	return (
		<div
			data-slot="tooltip"
			class={cn("group/tooltip relative inline-flex", className)}
		>
			{children}
			<span
				data-slot="tooltip-label"
				role="tooltip"
				class={cn(
					"pointer-events-none absolute z-10 flex items-center gap-1 whitespace-nowrap rounded-sm bg-accent px-2 py-1 text-accent-fg text-xs opacity-0 transition-opacity group-focus-within/tooltip:opacity-100 group-hover/tooltip:opacity-100",
					variants.placement[placement],
				)}
			>
				{label}
			</span>
		</div>
	);
}
