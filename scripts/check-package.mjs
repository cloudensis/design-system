// npm pack した tarball を利用側と同じ形で使い、exports と型定義を検証する。
// 先に npm run build を実行しておく。
import { execFileSync } from "node:child_process";
import { globSync } from "node:fs";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const pkg = JSON.parse(
	await fs.readFile(path.join(root, "package.json"), "utf8"),
);
const work = await fs.mkdtemp(path.join(os.tmpdir(), "check-package-"));
const failures = [];

try {
	// 1. pack して、利用側の node_modules に展開する。
	const [{ filename }] = JSON.parse(
		execFileSync("npm", ["pack", "--json", "--pack-destination", work], {
			cwd: root,
			encoding: "utf8",
		}),
	);
	const installed = path.join(work, "node_modules", pkg.name);
	await fs.mkdir(installed, { recursive: true });
	execFileSync("tar", [
		"xzf",
		path.join(work, filename),
		"-C",
		installed,
		"--strip-components=1",
	]);

	// 依存はリポジトリの node_modules を使う（ネットワークに出ない）。
	for (const dep of [
		...Object.keys(pkg.dependencies),
		...Object.keys(pkg.peerDependencies),
	]) {
		const target = path.join(work, "node_modules", dep);
		await fs.mkdir(path.dirname(target), { recursive: true });
		await fs.symlink(path.join(root, "node_modules", dep), target, "dir");
	}
	await fs.writeFile(
		path.join(work, "package.json"),
		JSON.stringify({ type: "module" }),
	);

	// 2. src の各モジュールが、配布物のパスで import できる。
	const entries = globSync("src/{components,brand,icons,lib}/**/*.{ts,tsx}", {
		cwd: root,
	})
		.filter((file) => !file.endsWith(".test.ts") && !file.endsWith(".test.tsx"))
		.map(
			(file) =>
				`${pkg.name}/${file.replace(/^src\//, "").replace(/\.tsx?$/, "")}`,
		);

	const runtimeCheck = `
		const entries = ${JSON.stringify(entries)};
		const failures = [];
		for (const entry of entries) {
			try { await import(entry); } catch (error) { failures.push(entry + ": " + error.message); }
		}
		// CSS Modules のクラス名の対応表は公開しない（ハッシュはバージョンごとに変わる）。
		for (const entry of ["components/button.module", "icons/icon.module", "brand/cloudensis/logo.module"]) {
			try { await import("${pkg.name}/" + entry); failures.push(entry + ": import できてしまう"); }
			catch (error) { if (error.code !== "ERR_PACKAGE_PATH_NOT_EXPORTED") failures.push(entry + ": " + error.message); }
		}
		console.log(JSON.stringify(failures));
	`;
	const runtimeFailures = JSON.parse(
		execFileSync("node", ["--input-type=module", "-e", runtimeCheck], {
			cwd: work,
			encoding: "utf8",
		}),
	);
	failures.push(...runtimeFailures.map((message) => `import: ${message}`));

	// 3. CSS の exports と、その中の相対 @import がファイルを指している。
	for (const [key, target] of Object.entries(pkg.exports)) {
		if (typeof target !== "string" || !target.endsWith(".css")) continue;
		const file = path.join(installed, target);
		const css = await fs.readFile(file, "utf8").catch(() => undefined);
		if (css === undefined) {
			failures.push(`css: ${key} → ${target} がない`);
			continue;
		}
		for (const [, specifier] of css.matchAll(/@import\s+"(\.[^"]+)"/g)) {
			const imported = path.resolve(path.dirname(file), specifier);
			await fs
				.access(imported)
				.catch(() =>
					failures.push(`css: ${target} の @import "${specifier}" がない`),
				);
		}
	}

	// 4. 型定義が、bundler と nodenext の両方で解決できる。
	const typeCheck = entries
		.map(
			(entry, index) =>
				`import * as m${index} from "${entry}";\nvoid m${index};`,
		)
		.join("\n");
	await fs.writeFile(path.join(work, "index.ts"), typeCheck);
	const tsc = path.join(root, "node_modules", ".bin", "tsc");
	for (const [module, moduleResolution] of [
		["preserve", "bundler"],
		["nodenext", "nodenext"],
	]) {
		try {
			execFileSync(
				tsc,
				[
					"--noEmit",
					"--strict",
					"--skipLibCheck",
					"false",
					"--target",
					"es2024",
					"--module",
					module,
					"--moduleResolution",
					moduleResolution,
					"--jsx",
					"react-jsx",
					"--jsxImportSource",
					"hono/jsx",
					"index.ts",
				],
				{ cwd: work, encoding: "utf8" },
			);
		} catch (error) {
			failures.push(`types (${moduleResolution}):\n${error.stdout}`);
		}
	}
} finally {
	await fs.rm(work, { recursive: true, force: true });
}

if (failures.length > 0) {
	console.error(failures.join("\n"));
	process.exit(1);
}
console.log("check-package: ok");
