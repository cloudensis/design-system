import { nav } from "./nav.ts";
import styles from "./side-nav.module.css";

type SideNavProps = {
	current: string;
};

export function SideNav({ current }: SideNavProps) {
	return (
		<nav aria-label="ドキュメント" class={styles.nav}>
			{nav.map((group, index) => {
				const labelId = group.label ? `nav-${group.label}` : undefined;
				return (
					<div key={String(index)} class={styles.group}>
						{group.label && (
							<p id={labelId} class={styles.groupLabel}>
								{group.label}
							</p>
						)}
						<ul aria-labelledby={labelId}>
							{group.items.map((item) => (
								<li key={item.href}>
									<a
										href={item.href}
										aria-current={item.href === current ? "page" : undefined}
										class={styles.link}
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
