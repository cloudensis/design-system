import type { Child } from "hono/jsx";
import { Fragment } from "hono/jsx";
import { cn } from "../../lib/utils.ts";

type DescriptionListProps = {
	class?: string;
	items: {
		term: Child;
		details: Child;
	}[];
};

export function DescriptionList({
	class: className,
	items,
}: DescriptionListProps) {
	return (
		<dl
			data-slot="description-list"
			class={cn("grid grid-cols-[auto_1fr] gap-x-6 gap-y-2", className)}
		>
			{items.map((item, index) => (
				<Fragment key={String(index)}>
					<dt>{item.term}</dt>
					<dd>{item.details}</dd>
				</Fragment>
			))}
		</dl>
	);
}
