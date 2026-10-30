import { LogoLockup } from "../../../../src/brand/cloudensis/logo-lockup.tsx";
import { LogoMark } from "../../../../src/brand/cloudensis/logo-mark.tsx";
import { LogoType } from "../../../../src/brand/cloudensis/logo-type.tsx";
import { cn } from "../../../../src/lib/utils.ts";
import shared from "../../shared.module.css";
import styles from "./cloudensis.module.css";

const logos = [
	{
		name: "LogoMark",
		file: "logo-mark",
		sample: <LogoMark label="cloudensis" />,
	},
	{
		name: "LogoType",
		file: "logo-type",
		sample: <LogoType class={styles.logoType} />,
	},
	{
		name: "LogoLockup",
		file: "logo-lockup",
		sample: (
			<div class={styles.lockups}>
				<div>
					<LogoLockup />
				</div>
				<div>
					<LogoLockup class={styles.largeLockup} />
				</div>
			</div>
		),
	},
];

export function Template() {
	return (
		<div class={shared.sections}>
			{logos.map((logo) => (
				<section key={logo.name} class={shared.section}>
					<h2 class={shared.heading3}>{logo.name}</h2>
					<p class={shared.path}>
						@cloudensis/design-system/brand/cloudensis/{logo.file}
					</p>
					<div class={cn(shared.preview, styles.sample)}>{logo.sample}</div>
				</section>
			))}
		</div>
	);
}
