import { LogoLockup } from "../../../../src/brand/cloudensis/logo-lockup.tsx";
import { LogoMark } from "../../../../src/brand/cloudensis/logo-mark.tsx";
import { LogoType } from "../../../../src/brand/cloudensis/logo-type.tsx";

const logos = [
	{
		name: "LogoMark",
		file: "logo-mark",
		sample: <LogoMark label="cloudensis" />,
	},
	{ name: "LogoType", file: "logo-type", sample: <LogoType class="text-xl" /> },
	{
		name: "LogoLockup",
		file: "logo-lockup",
		sample: (
			<div class="space-y-2">
				<div>
					<LogoLockup />
				</div>
				<div>
					<LogoLockup class="text-3xl" />
				</div>
			</div>
		),
	},
];

export function Template() {
	return (
		<div class="space-y-10">
			{logos.map((logo) => (
				<section key={logo.name} class="space-y-3">
					<h2 class="text-heading-3">{logo.name}</h2>
					<p class="break-all font-mono text-xs">
						@cloudensis/design-system/brand/cloudensis/{logo.file}
					</p>
					<div class="overflow-x-auto rounded-sm border border-default p-6">
						{logo.sample}
					</div>
				</section>
			))}
		</div>
	);
}
