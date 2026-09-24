const assetOrigin = "https://cloudensis.com";

export const site = {
	name: "cloudensis design system",
	description:
		"cloudensis で利用する CSS トークン・記事用スタイル・コンポーネントのドキュメント。",
	ogImage: { url: `${assetOrigin}/ogp.png`, width: 1200, height: 630 },
	favicon: `${assetOrigin}/favicon.svg`,
	logo: `${assetOrigin}/logo.png`,
	assetOrigin,
} as const;
