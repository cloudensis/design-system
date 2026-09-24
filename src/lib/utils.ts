import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/* tokens.css で追加したトークンのうち、tailwind-merge が既定では判別できない
   ものを登録します。登録しないと font-strong が font-family として扱われ、
   cn("font-strong", "font-mono") で太さが消えるなど、競合の解決を誤ります。
   色のトークン（text-fg-muted, bg-accent など）は既定のままで色として
   判別されるため、登録は不要です。トークンを追加したときはここも見直してください。 */
const twMerge = extendTailwindMerge({
	extend: {
		theme: {
			"font-weight": ["base", "strong"],
		},
	},
});

export const cn = (...inputs: ClassValue[]): string | undefined =>
	twMerge(clsx(inputs)) || undefined;
