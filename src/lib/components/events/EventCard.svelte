<script lang="ts">
	import type { EventRecord } from "$lib/pocketbase/types";
	import { DateTime } from "luxon";
	import { eventTypeColors } from "./colors";

	let { data }: { data: EventRecord } = $props();

	const type: "info" | "warning" | "error" = $derived(data.type as "info" | "warning" | "error");

	let color = $derived(eventTypeColors[type]);
</script>

<div class="flex items-center border shadow-md rounded-lg print:border-4 print:shadow-none">
	<div class="basis-48 text-center">timestamp</div>

	<div class={["rounded-lg p-4 space-y-3 flex-1 print:p-1", color]}>
		<header class="flex justify-between mb-0">
			<span class="text-xl font-bold"> {data.title} </span>
			<span> {DateTime.fromSQL(data.timestamp).toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS)} </span>
		</header>

		<p>
			{data.message}
		</p>
	</div>
</div>
