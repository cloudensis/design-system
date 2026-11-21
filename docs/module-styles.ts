/*
 * SSR では CSS Modules のスタイルが HTML に入らないため、文字列として集めて style 要素に書き出す。
 * 同じファイルからは同じクラス名が作られるので、コンポーネントが使うクラス名と一致する。
 */
const modules = import.meta.glob<string>(
	["../src/**/*.module.css", "./**/*.module.css"],
	{ query: "?inline", import: "default", eager: true },
);

export const moduleStyles = Object.values(modules).join("\n");
