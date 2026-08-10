<script lang="ts">
	import EventCard from "$lib/components/events/EventCard.svelte";
	import RecordingCard from "$lib/components/events/RecordingCard.svelte";

	import Nav from "$lib/components/layout/nav.svelte";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Separator } from "$lib/components/ui/separator/index.js";
	import type { PageProps } from "./$types";

	import { invalidateAll } from "$app/navigation";
	import { eventStyles } from "$lib/components/events/colors";
	import HoverInput from "$lib/components/events/HoverInput.svelte";
	import { getRecordingControllerCtx } from "$lib/context/recordingController.svelte";
	import { pb } from "$lib/pocketbase";
	import { Collections, type RecordingEventsResponse } from "$lib/pocketbase/types";
	import { getRelativeDuration } from "$lib/utils/calculateRelativeDuration";
	import { createNewEvent } from "$lib/utils/events";
	import Archive from "@lucide/svelte/icons/archive";
	import ArchiveRestore from "@lucide/svelte/icons/archive-restore";
	import Ban from "@lucide/svelte/icons/ban";
	import Download from "@lucide/svelte/icons/download";
	import Info from "@lucide/svelte/icons/info";
	import TriangleAlert from "@lucide/svelte/icons/triangle-alert";
	import { DateTime } from "luxon";
	import { onMount } from "svelte";
	import { toast } from "svelte-sonner";

	let { data }: PageProps = $props();

	const recordingController = getRecordingControllerCtx();

	// svelte-ignore state_referenced_locally
	let recording = $state(data.recording);

	$effect(() => {
		recording = data.recording;
		recordingController.recordings = [data.recording];
		recordingController.recordingEvents = data.events;
	});

	async function handleRecordingNameChange() {
		try {
			await pb.collection(Collections.Recordings).update(recording.id, { ...recording });
		} catch (err) {
			toast.error("Failed to update event title");
			console.error(err);
			invalidateAll();
		}
	}

	async function archiveRecording() {
		await pb.collection(Collections.Recordings).update(recording.id, { archived: true });
		invalidateAll();
	}

	async function restoreRecording() {
		await pb.collection(Collections.Recordings).update(recording.id, { archived: false });
		invalidateAll();
	}

	function parseDateTime(value: string) {
		const sqlDateTime = DateTime.fromSQL(value);
		if (sqlDateTime.isValid) return sqlDateTime;

		return DateTime.fromISO(value);
	}

	function getEventColor(type: RecordingEventsResponse["type"]) {
		if (type === "warning") return "Yellow";
		if (type === "error") return "Red";
		return "Blue";
	}

	function escapeCsvValue(value: string) {
		return `"${value.replaceAll('"', '""')}"`;
	}

	function exportRecordingEventsCsv() {
		const recordingStart = parseDateTime(recording.start);

		if (!recordingStart.isValid) {
			toast.error("Failed to export CSV");
			return;
		}

		const rows = recordingController.recordingEvents.map((event) => {
			const eventTimestamp = parseDateTime(event.timestamp);
			const relativeTimestamp = eventTimestamp.isValid
				? getRelativeDuration(recordingStart, eventTimestamp).toFormat("hh:mm:ss")
				: "";
			const actualTimestamp = eventTimestamp.isValid
				? eventTimestamp.toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS)
				: "";

			return [
				getEventColor(event.type),
				event.title,
				event.message,
				relativeTimestamp,
				actualTimestamp
			]
				.map((value) => escapeCsvValue(value ?? ""))
				.join(",");
		});

		const csv = [
			["Color", "Event name", "Event description", "Timecode", "Timestamp"].map(escapeCsvValue).join(","),
			...rows
		].join("\r\n");

		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		const recordingName = recording.recording_name.trim() || recording.filename.trim() || recording.id;
		const safeRecordingName = recordingName.replaceAll(/[^a-z0-9-_]+/gi, "-").replaceAll(/^-+|-+$/g, "") || "recording";

		link.href = url;
		link.download = `${safeRecordingName}-events.csv`;
		link.click();
		URL.revokeObjectURL(url);

		toast.success("CSV exported");
	}

	onMount(() => {
		pb.collection(Collections.RecordingEvents).subscribe<RecordingEventsResponse>("*", ({ action, record }) => {
			if (action === "create") recordingController.recordingEvents.push(record);
			if (action === "delete") recordingController.recordingEvents = recordingController.recordingEvents.filter((e) => e.id !== record.id);
			if (action === "update") recordingController.recordingEvents = recordingController.recordingEvents.map((e) => (e.id === record.id ? record : e));
		});

		pb.collection(Collections.Recordings).subscribe(recording.id, async () => {
			await invalidateAll();
		});

		return () => {
			pb.collection(Collections.Recordings).unsubscribe("*");
			pb.collection(Collections.RecordingEvents).unsubscribe("*");
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
		{:else if recordingController.state.active}
			<Button onclick={() => recordingController.stopRecording()} variant="outline" class="border-destructive bg-destructive text-white animate-pulse hover:text-destructive hover:cursor-pointer">Stop recording</Button>
		{:else}
			<Button variant="outline" class="hover:cursor-pointer" onclick={archiveRecording}><Archive /> Archive</Button>
		{/if}
		<Button variant="outline" href="/recordings">Back</Button>
	{/snippet}
</Nav>

<div class="w-2/3 mx-auto print:w-full">
	<div class="w-full flex flex-col gap-2">
		<RecordingCard>
			{#snippet left()}
				<HoverInput className={"bg-transparent! border-0 text-lg! font-bold px-1 hover:bg-white/20! w-44 focus-visible:ring-0"} bind:value={recording.recording_name} onchange={handleRecordingNameChange} disabled={recording.archived} />
			{/snippet}
			{#snippet center()}
				<span class="text-xl font-bold"> {recording.filename} </span>
			{/snippet}
			{#snippet right()}
				<span> {DateTime.fromSQL(recording.start).toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS)} </span>
			{/snippet}
		</RecordingCard>

		{@render separator()}

		<div class="flex flex-col gap-1">
			{#each recordingController.recordingEvents as event, i (event.id)}
				<EventCard recording={data.recording} bind:event={recordingController.recordingEvents[i]} />
			{/each}
		</div>

		{@render separator()}

		{#if recordingController.state.active}
			<div class="flex">
				<div class="basis-48"></div>
				<div class="flex-1">
					<Button onclick={() => createNewEvent(recording.id, "info", DateTime.now())} size="icon" class={[eventStyles.default.info, eventStyles.hover.info, "cursor-pointer"]}><Info /></Button>
					<Button onclick={() => createNewEvent(recording.id, "warning", DateTime.now())} size="icon" class={[eventStyles.default.warning, eventStyles.hover.warning, "cursor-pointer"]}><TriangleAlert /></Button>
					<Button onclick={() => createNewEvent(recording.id, "error", DateTime.now())} size="icon" class={[eventStyles.default.error, eventStyles.hover.error, "cursor-pointer"]}><Ban /></Button>
				</div>
			</div>
		{:else}
			<RecordingCard>
				{#snippet left()}
					<span class="text-xl font-bold"> Recording end </span>
				{/snippet}
				{#snippet center()}
					<span class="text-xl font-bold"> {getRelativeDuration(DateTime.fromSQL(recording.start), DateTime.fromSQL(recording.stop)).toFormat("hh:mm:ss")}</span>
				{/snippet}
				{#snippet right()}
					<span> {DateTime.fromSQL(recording.stop).toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS)} </span>
				{/snippet}
			</RecordingCard>
		{/if}
	</div>
</div>
