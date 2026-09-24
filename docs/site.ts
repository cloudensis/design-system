/* ドキュメントサイトのメタ情報。favicon・ロゴ・OGP 画像は cloudensis.com のものを参照します。 */
const assetOrigin = "https://cloudensis.com";

export const site = {
	name: "cloudensis design system",
	description:
		"cloudensis で利用する CSS トークン・記事用スタイル・コンポーネントのドキュメント。",
	/** OGP 画像の URL と実寸。og:image:width / height に渡します。 */
	ogImage: { url: `${assetOrigin}/ogp.png`, width: 1200, height: 630 },
	favicon: `${assetOrigin}/favicon.svg`,
	logo: `${assetOrigin}/logo.png`,
	assetOrigin,
} as const;
