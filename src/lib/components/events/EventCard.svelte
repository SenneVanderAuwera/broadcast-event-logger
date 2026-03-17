<script lang="ts">
	import type { RecordingEventsResponse, RecordingsResponse } from "$lib/pocketbase/types";
	import { getRelativeDuration } from "$lib/utils/calculateRelativeDuration";
	import { DateTime } from "luxon";
	import { eventStyles } from "./colors";
	import EventCardInputButton from "./EventCardInputButton.svelte";

	let { event = $bindable(), recording }: { event: RecordingEventsResponse; recording: RecordingsResponse } = $props();

	const type: "info" | "warning" | "error" = $derived(event.type as "info" | "warning" | "error");

	let color = $derived(eventStyles["default"][type]);
	let duration = $derived(getRelativeDuration(DateTime.fromSQL(recording.start), DateTime.fromSQL(event.timestamp)));

	function updateEventRecord() {}
</script>

<div class="flex items-center border shadow-md rounded-lg print:border-2 print:shadow-none">
	<div class="hidden print:block ms-2 size-8 border-2 rounded-md"></div>
	<div class="basis-48 text-center">{duration.toFormat("hh:mm:ss")}</div>

	<div class={["rounded-lg px-3 py-3 space-y-3 flex-1 print:p-1 print:bg-transparent print:text-foreground", color]}>
		<header class="flex justify-between mb-0 items-center">
			<EventCardInputButton buttonClass={"text-lg font-bold px-1 h-9 hover:bg-white/20 hover:text-white/90"} bind:event />
			<span class=""> {DateTime.fromSQL(event.timestamp).toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS)} </span>
		</header>

		<p>
			{event.message}
		</p>
	</div>
</div>
