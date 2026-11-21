import vitesseDark from "@shikijs/themes/vitesse-dark";
import {
	createHighlighterCoreSync,
	getTokenStyleObject,
	type HighlighterCore,
	stringifyTokenStyle,
} from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

/*
 * 背景（--background-color-emphasis）とのコントラスト比を 4.5 以上にする。
 * 半透明の色は不透明にし、足りない色は明るくする。
 */
const contrastFixes: Record<string, string> = {
	"#4d9375": "#599b7f",
	"#666666": "#8e8e8e",
	"#758575": "#849284",
};

const theme = {
	...vitesseDark,
	tokenColors: vitesseDark.tokenColors?.map((tokenColor) => {
		const foreground = tokenColor.settings.foreground
			?.slice(0, 7)
			.toLowerCase();
		if (!foreground) return tokenColor;
		return {
			...tokenColor,
			settings: {
				...tokenColor.settings,
				foreground: contrastFixes[foreground] ?? foreground,
			},
		};
	}),
};

/** ハイライトした 1 行分のトークン。style は style 属性にそのまま渡せる。 */
export type CodeToken = {
	content: string;
	style: string;
};

/** 対応していない言語なら undefined を返す。 */
export type Highlight<L extends string = string> = (
	code: string,
	lang: L,
) => CodeToken[][] | undefined;

type HighlighterOptions = Parameters<typeof createHighlighterCoreSync>[0];

export type CreateHighlightOptions = {
	/** @shikijs/langs/* の default export を渡す。 */
	langs: NonNullable<HighlighterOptions["langs"]>;
	/** 別名 → langs にある言語の名前。 */
	langAlias?: Record<string, string>;
};

/**
 * 渡した言語だけを同梱するハイライト関数を作る。
 * 文法は大きいため、使う言語だけを渡すとバンドルが小さくなる。
 * Shiki の初期化は最初に呼んだときに行う。
 */
export function createHighlight<L extends string = string>({
	langs,
	langAlias,
}: CreateHighlightOptions): Highlight<L> {
	let highlighter: HighlighterCore | undefined;

	return (code, lang) => {
		highlighter ??= createHighlighterCoreSync({
			engine: createJavaScriptRegexEngine(),
			langAlias,
			langs,
			themes: [theme],
		});
		if (!highlighter.getLoadedLanguages().includes(lang)) return undefined;

		return highlighter.codeToTokens(code, { lang, theme }).tokens.map((line) =>
			line.map((token) => ({
				content: token.content,
				style: stringifyTokenStyle(getTokenStyleObject(token)),
			})),
		);
	};
}
