import { cn } from "../../lib/utils.ts";
import styles from "./logo.module.css";
import { LogoMark } from "./logo-mark.tsx";
import { LogoType } from "./logo-type.tsx";

type LogoLockupProps = {
	class?: string;
};

/** 大きさは font-size で変える。 */
export function LogoLockup({ class: className }: LogoLockupProps) {
	return (
		<span class={cn(styles.lockup, className)}>
			<LogoMark />
			<LogoType />
		</span>
	);
}
