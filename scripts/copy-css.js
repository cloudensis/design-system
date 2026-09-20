import { cpSync, existsSync } from "node:fs";

const src = "src/styles";
const dest = "dist/styles";

if (!existsSync(src)) {
	throw new Error(`${src} が見つかりません`);
}

cpSync(src, dest, { recursive: true });
