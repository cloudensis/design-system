/* vite build でビルドした docs のアプリから HTML を書き出し、アプリは消す。 */
import fs from "node:fs/promises";
import type { Hono } from "hono";
import { toSSG } from "hono/ssg";

const app: Hono = (await import("../docs-dist/index.js")).default;
await toSSG(app, fs, { dir: "docs-dist" });
await fs.rm("docs-dist/index.js");
