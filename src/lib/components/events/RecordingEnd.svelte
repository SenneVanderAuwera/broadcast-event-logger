<script lang="ts">
	import type { RecordingsResponse } from "$lib/pocketbase/types";
	import { getRelativeDuration } from "$lib/utils/calculateRelativeDuration";
	import { DateTime } from "luxon";
	import RecordingCard from "./RecordingCard.svelte";

	let { recording }: { recording: RecordingsResponse } = $props();
</script>

<RecordingCard>
	{#snippet left()}
		<span class="text-xl font-bold">Recording end</span>
	{/snippet}
	{#snippet center()}
		<span class="text-xl font-bold">
			{getRelativeDuration(DateTime.fromSQL(recording.start), DateTime.fromSQL(recording.stop)).toFormat("hh:mm:ss")}
		</span>
	{/snippet}
	{#snippet right()}
		<span>{DateTime.fromSQL(recording.stop).toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS)}</span>
	{/snippet}
</RecordingCard>
