import { describe, expect, it } from "vitest";
import { cn } from "./utils.ts";

describe("cn", () => {
	it("クラス名をつなげる", () => {
		expect(cn("a", false, undefined, "b", { c: true, d: false })).toBe("a b c");
	});

	it("空のときは class 属性を出さないよう undefined を返す", () => {
		expect(cn()).toBeUndefined();
		expect(cn(false, undefined, "")).toBeUndefined();
	});
});
