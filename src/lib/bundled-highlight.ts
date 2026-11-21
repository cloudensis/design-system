import css from "@shikijs/langs/css";
import html from "@shikijs/langs/html";
import json from "@shikijs/langs/json";
import markdown from "@shikijs/langs/markdown";
import shellscript from "@shikijs/langs/shellscript";
import tsx from "@shikijs/langs/tsx";
import yaml from "@shikijs/langs/yaml";
import { createHighlight, type Highlight } from "./highlight.ts";

/*
 * よく使う言語をまとめて同梱したハイライト関数。
 * 文法を static import するため、このモジュールを import するだけでバンドルが大きくなる（minify 後 約 700KB）。
 * 使う言語が決まっているなら、lib/highlight の createHighlight で必要な文法だけを渡す。
 */

/** highlight が対応する、文法ごとの lang に渡せる名前。 */
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

/** html は javascript と css の文法も読み込む。tsx の文法で ts・jsx なども解析できる。 */
export const highlight: Highlight<CodeLanguage> = createHighlight<CodeLanguage>(
	{
		langs: [css, html, json, markdown, shellscript, tsx, yaml],
		langAlias: {
			jsonc: "json",
			jsx: "tsx",
			ts: "tsx",
			typescript: "tsx",
		},
	},
);
