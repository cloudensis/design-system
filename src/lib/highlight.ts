/* Shiki によるコードハイライト。文法とテーマを同梱した同期版のハイライターを
   使うため、await を挟まずに呼び出せます。正規表現エンジンには WASM を必要と
   しない JavaScript 実装を選んでいるので、Node.js・Cloudflare Workers・
   ブラウザのいずれでも同じように動作します。 */
import css from "@shikijs/langs/css";
import html from "@shikijs/langs/html";
import json from "@shikijs/langs/json";
import markdown from "@shikijs/langs/markdown";
import shellscript from "@shikijs/langs/shellscript";
import tsx from "@shikijs/langs/tsx";
import yaml from "@shikijs/langs/yaml";
import theme from "@shikijs/themes/vitesse-dark";
import {
	createHighlighterCoreSync,
	getTokenStyleObject,
	type HighlighterCore,
	stringifyTokenStyle,
} from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

const themeName = "vitesse-dark";

/* 同梱する文法。html は内部で javascript と css の文法も読み込むため、
   実際にはそれらも利用できます。 */
const langs = [css, html, json, markdown, shellscript, tsx, yaml];

/* 同じ文法で解析できる言語名を別名として登録します。tsx の文法は TypeScript や
   JavaScript もそのまま解析できるため、ts・jsx などは tsx に寄せています。
   md・js・sh・yml などの別名は文法側が持っているため、ここでの指定は不要です。 */
const langAlias = {
	jsonc: "json",
	jsx: "tsx",
	ts: "tsx",
	typescript: "tsx",
};

/** 同梱している文法ごとの、CodeBlock の lang に渡せる言語名。 */
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

/** CodeBlock の lang に渡せる言語名。 */
export type CodeLanguage =
	(typeof codeLanguages)[keyof typeof codeLanguages][number];

/** ハイライト後のトークン 1 つ。style はそのまま style 属性に渡せる文字列です。 */
export type CodeToken = {
	content: string;
	style: string;
};

/* ハイライターの生成は文法の読み込みを伴うため、最初に必要になった時点で 1 度
   だけ行い、以降はモジュールスコープで使い回します。 */
let highlighter: HighlighterCore | undefined;

const getHighlighter = (): HighlighterCore =>
	(highlighter ??= createHighlighterCoreSync({
		engine: createJavaScriptRegexEngine(),
		langAlias,
		langs,
		themes: [theme],
	}));

/**
 * コードを行ごとのトークンに分解します。同梱していない言語が渡された場合は
 * undefined を返すので、呼び出し側はハイライトなしで描画してください。
 */
export function highlight(
	code: string,
	lang: CodeLanguage,
): CodeToken[][] | undefined {
	const shiki = getHighlighter();
	if (!shiki.getLoadedLanguages().includes(lang)) return undefined;

	return shiki
		.codeToTokens(code, { lang, theme: themeName })
		.tokens.map((line) =>
			line.map((token) => ({
				content: token.content,
				style: stringifyTokenStyle(getTokenStyleObject(token)),
			})),
		);
}
