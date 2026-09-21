/* ドキュメントサイトのメタ情報。favicon と OGP 画像は cloudensis.com と
   同じものを public/ に置いて共用しています。 */
export const site = {
	name: "Cloudensis Design System",
	description:
		"cloudensis で利用する CSS トークン・記事用スタイル・コンポーネントのドキュメント。",
	/** OGP 画像のパスと実寸。og:image:width / height に渡します。 */
	ogImage: { path: "/ogp.png", width: 1200, height: 630 },
	favicon: "/favicon.svg",
	appleTouchIcon: "/logo.png",
} as const;
