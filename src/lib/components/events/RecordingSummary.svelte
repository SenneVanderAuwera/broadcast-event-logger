<script lang="ts">
	import HoverInput from "#lib/components/events/HoverInput.svelte";
	import { RecordingRecord } from "#lib/state/recordings.svelte.ts";
	import { refreshAll } from "$app/navigation";
	import { DateTime } from "luxon";
	import { toast } from "svelte-sonner";
	import RecordingCard from "./RecordingCard.svelte";
	import { updateRecording } from "#lib/remote/recordings.remote.ts";

	let { recording }: { recording: RecordingRecord } = $props();

	async function handleRecordingNameChange() {
		try {
			await updateRecording($state.snapshot(recording.record));
		} catch (err) {
			toast.error("Failed to update recording title");
			console.error(err);
			refreshAll();
		}
	}
</script>

<RecordingCard>
	{#snippet left()}
		<HoverInput className="bg-transparent! border-0 text-lg! font-bold px-1 hover:bg-white/20! w-44 focus-visible:ring-0" bind:value={recording.record.recording_name} onchange={handleRecordingNameChange} disabled={recording.record.archived} />
	{/snippet}
	{#snippet center()}
		<span class="text-xl font-bold">{recording.record.filename}</span>
	{/snippet}
	{#snippet right()}
		<span>{DateTime.fromSQL(recording.record.start).toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS)}</span>
	{/snippet}
</RecordingCard>
