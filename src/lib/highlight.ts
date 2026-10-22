import css from "@shikijs/langs/css";
import html from "@shikijs/langs/html";
import json from "@shikijs/langs/json";
import markdown from "@shikijs/langs/markdown";
import shellscript from "@shikijs/langs/shellscript";
import tsx from "@shikijs/langs/tsx";
import yaml from "@shikijs/langs/yaml";
import vitesseDark from "@shikijs/themes/vitesse-dark";
import {
	createHighlighterCoreSync,
	getTokenStyleObject,
	type HighlighterCore,
	stringifyTokenStyle,
} from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

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

const langs = [css, html, json, markdown, shellscript, tsx, yaml];

const langAlias = {
	jsonc: "json",
	jsx: "tsx",
	ts: "tsx",
	typescript: "tsx",
};

export const codeLanguages = {
	CSS: ["css"],
	HTML: ["html"],
	JavaScript: ["javascript", "js"],
	JSON: ["json", "jsonc"],
	Markdown: ["markdown", "md"],
	Shell: ["shellscript", "sh", "bash", "shell", "zsh"],
	"TypeScript / TSX": ["tsx", "ts", "typescript", "jsx"],
	YAML: ["yaml", "yml"],
} as const;

export type CodeLanguage =
	(typeof codeLanguages)[keyof typeof codeLanguages][number];

export type CodeToken = {
	content: string;
	style: string;
};

let highlighter: HighlighterCore | undefined;

const getHighlighter = (): HighlighterCore =>
	(highlighter ??= createHighlighterCoreSync({
		engine: createJavaScriptRegexEngine(),
		langAlias,
		langs,
		themes: [theme],
	}));

export function highlight(
	code: string,
	lang: CodeLanguage,
): CodeToken[][] | undefined {
	const shiki = getHighlighter();
	if (!shiki.getLoadedLanguages().includes(lang)) return undefined;

	return shiki.codeToTokens(code, { lang, theme }).tokens.map((line) =>
		line.map((token) => ({
			content: token.content,
			style: stringifyTokenStyle(getTokenStyleObject(token)),
		})),
	);
}
