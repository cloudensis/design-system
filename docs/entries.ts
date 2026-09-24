import pkg from "../package.json";

/* package.json の exports から、公開しているエントリの一覧を作ります。
   ./components/* はファイルに展開し、JS のエントリは export している名前を並べます。 */
const modules: Record<string, Record<string, unknown>> = import.meta.glob(
	["../src/components/**/*.tsx", "../src/lib/*.ts"],
	{ eager: true },
);

const cssDescriptions: Record<string, string> = {
	"index.css": "下記の CSS をまとめたエントリ（通常はこれを読み込む）",
	"fonts.css": "Outfit / Noto Sans JP の @font-face 定義",
	"tokens.css": "@theme によるトークン定義",
	"base.css": "body の既定のスタイル（配色・文字の太さ）",
	"prose.css": "記事本文用のスタイル",
};

const toEntryPath = (file: string) =>
	file.replace("../src/", "").replace(/\.tsx?$/, "");

export const entries = Object.keys(pkg.exports).flatMap((key) => {
	const path = key.replace("./", "");
	if (path.endsWith(".css")) {
		return [{ path, content: cssDescriptions[path] ?? "" }];
	}
	const prefix = path.replace("*", "");
	return Object.entries(modules)
		.filter(([file]) =>
			path.endsWith("*")
				? toEntryPath(file).startsWith(prefix)
				: toEntryPath(file) === path,
		)
		.map(([file, module]) => ({
			path: toEntryPath(file),
			content: Object.keys(module).join(" / "),
		}));
});
