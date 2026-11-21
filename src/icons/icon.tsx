import type { Child, JSX } from "hono/jsx";
import { cn } from "../lib/utils.ts";
import styles from "./icon.module.css";

/** svg 要素の属性（style、data-*、aria-* など）はそのまま渡せる。 */
export type IconProps = Omit<JSX.HTMLAttributes, "children" | "viewBox"> & {
	class?: string;
	/** 省略すると装飾として扱う。 */
	label?: string;
};

type IconBaseProps = IconProps & {
	viewBox: string;
	children: Child;
};

/** 大きさは各アイコンで指定する。 */
export function Icon({
	class: className,
	label,
	viewBox,
	children,
	...props
}: IconBaseProps) {
	return (
		<svg
			class={cn(styles.icon, className)}
			viewBox={viewBox}
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			role={label ? "img" : undefined}
			aria-label={label}
			aria-hidden={label ? undefined : "true"}
			{...props}
		>
			{children}
		</svg>
	);
}

/**
 * 24 × 24 の線のアイコンを作る。既定の大きさは 1rem で、class で変えられる。
 * アイコンを足すときは、パスを渡すだけでよい。
 */
export function createIcon(paths: Child) {
	return function SizedIcon({ class: className, ...props }: IconProps) {
		return (
			<Icon viewBox="0 0 24 24" class={cn(styles.size, className)} {...props}>
				{paths}
			</Icon>
		);
	};
}
