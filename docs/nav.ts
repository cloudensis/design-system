export type NavItem = { href: string; label: string };

export type NavGroup = { label?: string; items: NavItem[] };

export const nav: NavGroup[] = [
	{ items: [{ href: "/", label: "Overview" }] },
	{
		label: "styles",
		items: [
			{ href: "/styles/colors", label: "Colors" },
			{ href: "/styles/typography", label: "Typography" },
			{ href: "/styles/prose", label: "Prose" },
		],
	},
	{
		label: "components",
		items: [{ href: "/components/button", label: "Button" }],
	},
	{
		label: "brand",
		items: [{ href: "/brand/cloudensis", label: "cloudensis" }],
	},
	{ items: [{ href: "/assets", label: "Assets" }] },
];
