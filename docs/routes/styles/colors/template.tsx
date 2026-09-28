import colorsCss from "../../../../src/styles/colors.css?raw";

const colors = [...colorsCss.matchAll(/--([\w-]+):\s*([^;]+);/g)].map(
	([, name, value]) => ({ name, value: value.trim() }),
);

export function Template() {
	return (
		<table class="w-full text-left text-sm">
			<thead>
				<tr>
					<th class="py-2 font-medium">名前</th>
					<th class="py-2 font-medium">値</th>
					<th class="py-2 font-medium">見本</th>
				</tr>
			</thead>
			<tbody>
				{colors.map(({ name, value }) => (
					<tr key={name}>
						<td class="py-2 font-mono">--{name}</td>
						<td class="py-2 font-mono">{value}</td>
						<td class="py-2">
							<span
								class="inline-block size-6 rounded-sm border align-middle"
								style={`background-color: ${value}`}
							/>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}
