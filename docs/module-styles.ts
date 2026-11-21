/*
 * SSR では CSS Modules のスタイルが HTML に入らないため、文字列として集めて /module-styles.css で配信する。
 * ページごとに埋め込まずファイルにすることで、ブラウザがキャッシュできる。
 * 同じファイルからは同じクラス名が作られるので、コンポーネントが使うクラス名と一致する。
 */
const modules = import.meta.glob<string>(
	["../src/**/*.module.css", "./**/*.module.css"],
	{ query: "?inline", import: "default", eager: true },
);

export const moduleStyles = Object.values(modules).join("\n");

/* 内容が変わったら URL を変え、古いキャッシュを使わせない（FNV-1a）。 */
let hash = 0x811c9dc5;
for (let i = 0; i < moduleStyles.length; i++) {
	hash ^= moduleStyles.charCodeAt(i);
	hash = Math.imul(hash, 0x01000193);
}

export const moduleStylesPath = "/module-styles.css";
export const moduleStylesUrl = `${moduleStylesPath}?v=${(hash >>> 0).toString(36)}`;
