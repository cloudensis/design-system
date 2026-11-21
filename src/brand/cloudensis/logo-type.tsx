import { cn } from "../../lib/utils.ts";
import styles from "./logo.module.css";

type LogoTypeProps = {
	class?: string;
};

export function LogoType({ class: className }: LogoTypeProps) {
	return <span class={cn(styles.type, className)}>cloudensis</span>;
}
