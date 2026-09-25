<script lang="ts">
	import { invalidateAll } from "$app/navigation";
	import HoverInput from "$lib/components/events/HoverInput.svelte";
	import { pb } from "$lib/pocketbase";
	import { Collections, type RecordingsResponse } from "$lib/pocketbase/types";
	import { DateTime } from "luxon";
	import { toast } from "svelte-sonner";
	import RecordingCard from "./RecordingCard.svelte";

	let { recording }: { recording: RecordingsResponse } = $props();

	async function handleRecordingNameChange() {
		try {
			await pb.collection(Collections.Recordings).update(recording.id, { ...recording });
		} catch (err) {
			toast.error("Failed to update recording title");
			console.error(err);
			invalidateAll();
		}
	}
</script>

<RecordingCard>
	{#snippet left()}
		<HoverInput className="bg-transparent! border-0 text-lg! font-bold px-1 hover:bg-white/20! w-44 focus-visible:ring-0" bind:value={recording.recording_name} onchange={handleRecordingNameChange} disabled={recording.archived} />
	{/snippet}
	{#snippet center()}
		<span class="text-xl font-bold">{recording.filename}</span>
	{/snippet}
	{#snippet right()}
		<span>{DateTime.fromSQL(recording.start).toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS)}</span>
	{/snippet}
</RecordingCard>
