const assets = [
	{ file: "favicon.svg", width: 42, height: 24, description: "favicon" },
	{
		file: "logo.png",
		width: 512,
		height: 512,
		description: "apple-touch-icon など",
	},
	{ file: "ogp.png", width: 1200, height: 630, description: "OGP 画像" },
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
						alt={asset.file}
						width={asset.width}
						height={asset.height}
						class="h-auto max-h-64 w-auto max-w-full rounded-sm border border-default bg-white"
					/>
				</section>
			))}
		</div>
	);
}
