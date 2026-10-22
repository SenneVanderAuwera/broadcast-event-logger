<script lang="ts">
	import EventCard from "#lib/components/events/EventCard.svelte";
	import NewEventButtons from "#lib/components/events/NewEventButtons.svelte";
	import RecordingEnd from "#lib/components/events/RecordingEnd.svelte";
	import RecordingSummary from "#lib/components/events/RecordingSummary.svelte";
	import { RecordingEventRecord } from "#lib/state/recordings.svelte.ts";

	import Nav from "#lib/components/layout/nav.svelte";
	import { Button } from "#lib/components/ui/button/index.js";
	import { Separator } from "#lib/components/ui/separator/index.js";

	import { pb } from "#lib/pocketbase/index.svelte.js";
	import { Collections, type RecordingEventsResponse } from "#lib/pocketbase/types.js";
	import { getRecording } from "#lib/remote/recordings.remote.ts";
	import { RecordingRecord, RecordingsState } from "#lib/state/recordings.svelte.ts";
	import { exportRecordingEventsCsv as createCsvDownload } from "#lib/utils/exportRecordingEventsCsv.js";
	import { refreshAll } from "$app/navigation";
	import { page } from "$app/state";
	import Archive from "@lucide/svelte/icons/archive";
	import ArchiveRestore from "@lucide/svelte/icons/archive-restore";
	import Download from "@lucide/svelte/icons/download";
	import { onMount } from "svelte";
	import { toast } from "svelte-sonner";

	const recordingState = new RecordingsState();

	const recording = $derived(new RecordingRecord(await getRecording(page.params.id ?? "")));

	const exportRecordingEventsCsv = async () => {
		if (
			!createCsvDownload(
				recording.record,
				recordingState.recordingEvents.map((e) => e.record),
			)
		) {
			toast.error("Failed to export CSV");
			return;
		}
		toast.success("CSV exported");
	};

	onMount(() => {
		pb.collection(Collections.RecordingEvents).subscribe<RecordingEventsResponse>("*", ({ action, record }) => {
			recordingState.recordingEventsQuery.refresh();
		});

		pb.collection(Collections.Recordings).subscribe(recording.record.id, async () => {
			recordingState.recordingsQuery.refresh();
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
			<Button variant="outline" class="hover:cursor-pointer" onclick={() => recording.restore()}><ArchiveRestore /> Restore</Button>
		{:else if recordingState.active}
			<Button onclick={() => recordingState.stopActiveRecording()} variant="outline" class="border-destructive bg-destructive text-white animate-pulse hover:text-destructive hover:cursor-pointer">Stop recording</Button>
		{:else}
			<Button variant="outline" class="hover:cursor-pointer" onclick={() => recording.archive()}><Archive /> Archive</Button>
		{/if}
		<Button variant="outline" href="/recordings">Back</Button>
	{/snippet}
</Nav>

<div class="w-2/3 mx-auto print:w-full">
	<div class="w-full flex flex-col gap-2">
		<RecordingSummary recording={recording.record} />

		{@render separator()}

		<div class="flex flex-col gap-1">
			{#each recordingState.recordingEvents as event, i (event.record.id)}
				<EventCard {recording} {event} />
			{/each}
		</div>

		{@render separator()}

		{#if recordingState.active}
			<NewEventButtons recordingId={recording.record.id} />
		{:else}
			<RecordingEnd recording={recording.record} />
		{/if}
	</div>
</div>
