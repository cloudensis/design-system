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
		<div class="space-y-10">
			{assets.map((asset) => (
				<section key={asset.file} class="space-y-3">
					<h2 class="text-heading-3">{asset.file}</h2>
					<p class="text-sm">
						{asset.description}（{asset.width} × {asset.height}）
					</p>
					<p class="font-mono text-xs">
						@cloudensis/design-system/assets/{asset.file}
					</p>
					<img
						src={`/${asset.file}`}
						alt={asset.alt}
						width={asset.width}
						height={asset.height}
						class="scheme-light h-auto max-h-64 w-auto max-w-full rounded-sm border border-default p-4"
					/>
				</section>
			))}
		</div>
	);
}
