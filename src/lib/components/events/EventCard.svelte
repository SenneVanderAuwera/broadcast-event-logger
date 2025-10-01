<script lang="ts">
	import type { EventRecord } from "$lib/pocketbase/types";
	import { eventTypeColors } from "./colors";

	let { data }: { data: EventRecord } = $props();

	const type: "info" | "warning" | "error" = $derived(data.type as "info" | "warning" | "error");

	let color = $derived(eventTypeColors[type]);
</script>

<div class="flex items-center border shadow-md rounded-lg print:border-4 print:shadow-none">
	<div class="basis-48 text-center">timestamp</div>

	<div class={["rounded-lg p-4 space-y-3 flex-1 print:p-1", color]}>
		<header class="flex justify-between">
			<span class="text-xl font-bold"> Event title </span>
			<span> Event date </span>
		</header>

		<p>
			Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatem quas inventore tempore voluptas temporibus consequuntur? Assumenda, et repellendus error eligendi voluptatibus magnam ab nobis provident, laudantium magni maxime? Ipsam,
			minima.
		</p>
	</div>
</div>
