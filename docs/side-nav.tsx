import { nav } from "./nav.ts";

type SideNavProps = {
	current: string;
};

export function SideNav({ current }: SideNavProps) {
	return (
		<nav aria-label="ドキュメント" class="space-y-6 text-sm">
			{nav.map((group, index) => {
				const labelId = group.label ? `nav-${group.label}` : undefined;
				return (
					<div key={String(index)} class="space-y-1">
						{group.label && (
							<p id={labelId} class="px-2 font-mono text-xs">
								{group.label}
							</p>
						)}
						<ul aria-labelledby={labelId}>
							{group.items.map((item) => (
								<li key={item.href}>
									<a
										href={item.href}
										aria-current={item.href === current ? "page" : undefined}
										class="block rounded-sm px-2 py-1.5 hover:underline aria-[current=page]:bg-emphasis aria-[current=page]:font-semibold aria-[current=page]:text-on-emphasis aria-[current=page]:no-underline"
									>
										{item.label}
									</a>
								</li>
							))}
						</ul>
					</div>
				);
			})}
		</nav>
	);
}
