import { LogoLockup } from "@cloudensis/design-system/brand/cloudensis/logo-lockup";
import { LogoMark } from "@cloudensis/design-system/brand/cloudensis/logo-mark";
import { LogoType } from "@cloudensis/design-system/brand/cloudensis/logo-type";
import { cn } from "@cloudensis/design-system/lib/utils";
import type { Handler } from "hono";
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

function Page() {
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

const ssg = true;

const GET: Handler = (c) =>
	c.render(<Page />, {
		title: "cloudensis",
		description: "cloudensis のロゴ",
	});

export { GET, ssg };
