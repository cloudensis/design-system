import shared from "../shared.module.css";
import styles from "./assets.module.css";

const assets = [
	{
		file: "favicon.svg",
		width: 42,
		height: 24,
		description: "favicon",
		alt: "cloudensis のロゴマーク",
	},
	{
		file: "logo.png",
		width: 512,
		height: 512,
		description: "apple-touch-icon など",
		alt: "cloudensis のロゴマーク",
	},
	{
		file: "ogp.png",
		width: 1200,
		height: 630,
		description: "OGP 画像",
		alt: "cloudensis のロゴ",
	},
];

export function Template() {
	return (
		<div class={shared.sections}>
			{assets.map((asset) => (
				<section key={asset.file} class={shared.section}>
					<h2 class={shared.heading3}>{asset.file}</h2>
					<p class={shared.note}>
						{asset.description}（{asset.width} × {asset.height}）
					</p>
					<p class={shared.path}>
						@cloudensis/design-system/assets/{asset.file}
					</p>
					<img
						src={`/${asset.file}`}
						alt={asset.alt}
						width={asset.width}
						height={asset.height}
						class={styles.image}
					/>
				</section>
			))}
		</div>
	);
}
