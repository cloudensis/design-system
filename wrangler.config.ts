import { defineWranglerConfig } from "wrangler/experimental-config";

/* cf はビルドを Wrangler に委譲するため、ツール側の設定はこちらに置く。 */
export default defineWranglerConfig({
	assetsDirectory: "./docs-dist",
});
