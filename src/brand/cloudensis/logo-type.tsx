import type { JSX } from "hono/jsx";
import { cn } from "../../lib/utils.ts";
import styles from "./logo.module.css";

/** span 要素の属性はそのまま渡せる。 */
type LogoTypeProps = Omit<JSX.IntrinsicElements["span"], "children"> & {
	class?: string;
};

export function LogoType({ class: className, ...props }: LogoTypeProps) {
	return (
		<span class={cn(styles.type, className)} {...props}>
			cloudensis
		</span>
	);
}
