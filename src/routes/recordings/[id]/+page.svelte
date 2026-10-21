<script lang="ts">
	import EventCard from "#lib/components/events/EventCard.svelte";
	import NewEventButtons from "#lib/components/events/NewEventButtons.svelte";
	import RecordingEnd from "#lib/components/events/RecordingEnd.svelte";
	import RecordingSummary from "#lib/components/events/RecordingSummary.svelte";

	import Nav from "#lib/components/layout/nav.svelte";
	import { Button } from "#lib/components/ui/button/index.js";
	import { Separator } from "#lib/components/ui/separator/index.js";

	import { getRecordingControllerCtx } from "#lib/context/recordingController.svelte.js";
	import { pb } from "#lib/pocketbase/index.svelte.js";
	import { Collections, type RecordingEventsResponse } from "#lib/pocketbase/types.js";
	import { getRecording } from "#lib/remote/recordings.remote.ts";
	import { RecordingRecord } from "#lib/state/recordings.svelte.ts";
	import { exportRecordingEventsCsv as createCsvDownload } from "#lib/utils/exportRecordingEventsCsv.js";
	import { refreshAll } from "$app/navigation";
	import { page } from "$app/state";
	import Archive from "@lucide/svelte/icons/archive";
	import ArchiveRestore from "@lucide/svelte/icons/archive-restore";
	import Download from "@lucide/svelte/icons/download";
	import { onMount } from "svelte";
	import { toast } from "svelte-sonner";

	const recordingController = getRecordingControllerCtx();

	const recording = $derived(new RecordingRecord(await getRecording(page.params.id)));

	const exportRecordingEventsCsv = async () => {
		if (!createCsvDownload(recording.record, recordingController.recordingEvents)) {
			toast.error("Failed to export CSV");
			return;
		}
		toast.success("CSV exported");
	};

	onMount(() => {
		pb.collection(Collections.RecordingEvents).subscribe<RecordingEventsResponse>("*", ({ action, record }) => {
			if (action === "create") recordingController.recordingEvents.push(record);
			if (action === "delete") recordingController.recordingEvents = recordingController.recordingEvents.filter((e) => e.id !== record.id);
			if (action === "update") recordingController.recordingEvents = recordingController.recordingEvents.map((e) => (e.id === record.id ? record : e));
		});

		pb.collection(Collections.Recordings).subscribe(recording.record.id, async () => {
			await refreshAll();
		});

		return () => {
			pb.collection(Collections.Recordings).unsubscribe();
			pb.collection(Collections.RecordingEvents).unsubscribe();
		};
	});
</script>

{#snippet separator()}
	<div class="flex">
		<div class="basis-48"></div>
		<div class="flex-1">
			<Separator />
		</div>
	</div>
{/snippet}

<Nav>
	{#snippet right()}
		<Button variant="outline" class="hover:cursor-pointer" onclick={exportRecordingEventsCsv} disabled={!recording.record.id}>
			<Download />
			Export CSV
		</Button>
		{#if recording.record.archived}
			<Button variant="outline" class="hover:cursor-pointer" onclick={() => recording.archiveRecording()}><ArchiveRestore /> Restore</Button>
		{:else if recordingController.state.active}
			<Button onclick={() => recordingController.stopRecording()} variant="outline" class="border-destructive bg-destructive text-white animate-pulse hover:text-destructive hover:cursor-pointer">Stop recording</Button>
		{:else}
			<Button variant="outline" class="hover:cursor-pointer" onclick={() => recording.archiveRecording()}><Archive /> Archive</Button>
		{/if}
		<Button variant="outline" href="/recordings">Back</Button>
	{/snippet}
</Nav>

<div class="w-2/3 mx-auto print:w-full">
	<div class="w-full flex flex-col gap-2">
		<RecordingSummary recording={recording.record} />

		{@render separator()}

		<div class="flex flex-col gap-1">
			{#each recordingController.recordingEvents as event, i (event.id)}
				<EventCard recording={recording.record} bind:event={recordingController.recordingEvents[i]} />
			{/each}
		</div>

		{@render separator()}

		{#if recordingController.state.active}
			<NewEventButtons recordingId={recording.record.id} />
		{:else}
			<RecordingEnd recording={recording.record} />
		{/if}
	</div>
</div>
