<script lang="ts">
	import type { RecordingRecord } from "#lib/state/recordings.svelte.ts";
	import { getRelativeDuration } from "#lib/utils/calculateRelativeDuration.js";
	import { DateTime } from "luxon";
	import RecordingCard from "./RecordingCard.svelte";

	let { recording }: { recording: RecordingRecord } = $props();

	const stopTimeDateTime = $derived(DateTime.fromSQL(recording.record.stop));
	const recordingDuration = $derived(getRelativeDuration(DateTime.fromSQL(recording.record.start), stopTimeDateTime));
</script>

<RecordingCard>
	{#snippet left()}
		<span class="text-xl font-bold">Recording end</span>
	{/snippet}
	{#snippet center()}
		<span class="text-xl font-bold">
			{recordingDuration.toFormat("hh:mm:ss")}
		</span>
	{/snippet}
	{#snippet right()}
		<span>{stopTimeDateTime.toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS)}</span>
	{/snippet}
</RecordingCard>
