<script lang="ts">
	import type { EventResponse, RecordingResponse } from "$lib/pocketbase/types";
	import { getRelativeDuration } from "$lib/utils/calculateRelativeDuration";
	import { DateTime } from "luxon";
	import { eventTypeColors } from "./colors";

	let { data, recording }: { data: EventResponse; recording: RecordingResponse } = $props();

	const type: "info" | "warning" | "error" = $derived(data.type as "info" | "warning" | "error");

	let color = $derived(eventTypeColors[type]);
	let duration = $derived(getRelativeDuration(DateTime.fromSQL(recording.start), DateTime.fromSQL(data.timestamp)));
</script>

<div class="flex items-center border shadow-md rounded-lg print:border-2 print:shadow-none">
	<div class="hidden print:block ms-2 size-8 border-2 rounded-md"></div>
	<div class="basis-48 text-center">{duration.toFormat("hh:mm:ss")}</div>

	<div class={["rounded-lg p-4 space-y-3 flex-1 print:p-1 pointer-events-none print:bg-transparent print:text-foreground", color]}>
		<header class="flex justify-between mb-0">
			<span class="text-xl font-bold"> {data.title} </span>
			<span> {DateTime.fromSQL(data.timestamp).toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS)} </span>
		</header>

		<p>
			{data.message}
		</p>
	</div>
</div>
