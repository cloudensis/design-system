import type { Child } from "hono/jsx";

type SectionProps = {
	id?: string;
	title: string;
	class?: string;
	children: Child;
};

export function Section({
	id,
	title,
	class: className,
	children,
}: SectionProps) {
	return (
		<section data-slot="section" id={id} class={className}>
			<h2 class="mb-4 font-medium text-xl">{title}</h2>
			{children}
		</section>
	);
}
