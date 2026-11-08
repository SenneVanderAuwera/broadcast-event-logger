<script lang="ts">
	import EventCard from "#lib/components/events/EventCard.svelte";
	import NewEventButtons from "#lib/components/events/NewEventButtons.svelte";
	import RecordingEnd from "#lib/components/events/RecordingEnd.svelte";
	import RecordingSummary from "#lib/components/events/RecordingSummary.svelte";

	import Nav from "#lib/components/layout/nav.svelte";
	import { Button } from "#lib/components/ui/button/index.js";
	import { Separator } from "#lib/components/ui/separator/index.js";

	import { pb } from "#lib/pocketbase/index.ts";
	import { Collections, type RecordingEventsResponse } from "#lib/pocketbase/types.ts";
	import { exportRecordingEventsCsv as createCsvDownload } from "#lib/utils/exportRecordingEventsCsv.ts";
	import { refreshAll } from "$app/navigation";
	import Archive from "@lucide/svelte/icons/archive";
	import ArchiveRestore from "@lucide/svelte/icons/archive-restore";
	import Download from "@lucide/svelte/icons/download";
	import { onMount } from "svelte";
	import { toast } from "svelte-sonner";
	import type { PageProps } from "./$types";

	const { data }: PageProps = $props();

	let recording = $state({} as PageProps["data"]["recording"]);
	let events = $state([] as PageProps["data"]["events"]);

	const isRecordingActive = $derived(recording.stop === null);

	async function stopRecording() {
		await pb.collection(Collections.Recordings).update(recording.id, { stop: new Date().toISOString() });
		await refreshAll();
	}

	async function archiveRecording() {
		await pb.collection(Collections.Recordings).update(recording.id, { archived: true });
		await refreshAll();
	}

	async function restoreRecording() {
		await pb.collection(Collections.Recordings).update(recording.id, { archived: false });
		await refreshAll();
	}

	function exportRecordingEventsCsv() {
		if (!createCsvDownload(recording, events)) {
			toast.error("Failed to export CSV");
			return;
		}
		toast.success("CSV exported");
	}

	onMount(() => {
		recording = data.recording;

		pb.collection(Collections.RecordingEvents).subscribe<RecordingEventsResponse>("*", ({ action, record }) => {
			if (action === "create") events.push(record);
			if (action === "delete") events = events.filter((e) => e.id !== record.id);
			if (action === "update") events = events.map((e) => (e.id === record.id ? record : e));
		});

		pb.collection(Collections.Recordings).subscribe(recording.id, async () => {
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
		<Button variant="outline" class="hover:cursor-pointer" onclick={exportRecordingEventsCsv} disabled={!recording.id}>
			<Download />
			Export CSV
		</Button>
		{#if recording.archived}
			<Button variant="outline" class="hover:cursor-pointer" onclick={restoreRecording}><ArchiveRestore /> Restore</Button>
		{:else if isRecordingActive}
			<Button onclick={stopRecording} variant="outline" class="border-destructive bg-destructive text-white animate-pulse hover:text-destructive hover:cursor-pointer">Stop recording</Button>
		{:else}
			<Button variant="outline" class="hover:cursor-pointer" onclick={archiveRecording}><Archive /> Archive</Button>
		{/if}
		<Button variant="outline" href="/recordings">Back</Button>
	{/snippet}
</Nav>

<div class="w-2/3 mx-auto print:w-full">
	<div class="w-full flex flex-col gap-2">
		<RecordingSummary bind:recording />

		{@render separator()}

		<div class="flex flex-col gap-1">
			{#each events as event, i (event.id)}
				<EventCard {recording} bind:event={events[i]} />
			{/each}
		</div>

		{@render separator()}

		{#if isRecordingActive}
			<NewEventButtons recordingId={recording.id} />
		{:else}
			<RecordingEnd {recording} />
		{/if}
	</div>
</div>
