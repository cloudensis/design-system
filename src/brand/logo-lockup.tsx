import { cn } from "../lib/utils.ts";
import { LogoMark } from "./logo-mark.tsx";
import { LogoType } from "./logo-type.tsx";

type LogoLockupProps = {
	class?: string;
};

/**
 * LogoMark と LogoType の横組み。
 * マークの高さと間隔は em で決めているので、text-* だけで全体の大きさが変わる。
 */
export function LogoLockup({ class: className }: LogoLockupProps) {
	return (
		<span
			class={cn("inline-flex items-baseline gap-[0.4em] text-xl", className)}
		>
			<LogoMark class="h-[0.8em]" />
			<LogoType />
		</span>
	);
}
