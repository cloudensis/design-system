import { cn } from "../lib/utils.ts";

type LogoTypeProps = {
	class?: string;
};

/** ロゴのテキスト部分。大きさは文字サイズに従う。 */
export function LogoType({ class: className }: LogoTypeProps) {
	return (
		<span class={cn("font-extralight tracking-wider", className)}>
			cloudensis
		</span>
	);
}
