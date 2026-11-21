// 配布物を利用側と同じようにバンドルし、サイズの上限を超えていないか確かめる。
// 先に npm run build を実行しておく。
import { fileURLToPath } from "node:url";
import { build } from "vite";

/* minify 後のサイズの上限（バイト）。超えたら理由を確かめてから上げる。 */
const limits = {
	/* ハイライトしない CodeBlock は Shiki を含まない。 */
	"components/code-block.js": 10_000,
	"components/button.js": 3_000,
	/* createHighlight は Shiki の本体だけを含み、文法は利用側が選ぶ。 */
	"lib/highlight.js": 250_000,
};

const root = fileURLToPath(new URL("..", import.meta.url));
let failed = false;

for (const [entry, limit] of Object.entries(limits)) {
	const result = await build({
		root,
		configFile: false,
		logLevel: "silent",
		build: {
			write: false,
			minify: true,
			lib: { entry: `dist/${entry}`, formats: ["es"], fileName: "out" },
			rolldownOptions: { external: (id) => id.startsWith("hono") },
		},
	});
	const outputs = (Array.isArray(result) ? result : [result]).flatMap(
		(r) => r.output,
	);
	const size = outputs
		.filter((o) => o.type === "chunk")
		.reduce((sum, o) => sum + Buffer.byteLength(o.code), 0);
	const ok = size <= limit;
	failed ||= !ok;
	console.log(`${ok ? "ok" : "NG"} ${entry}: ${size} / ${limit} bytes`);
}

if (failed) process.exit(1);
