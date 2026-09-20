import { cpSync, existsSync } from "node:fs";

const src = "src/styles";
const dest = "dist/styles";

if (existsSync(src)) {
	cpSync(src, dest, { recursive: true });
}
