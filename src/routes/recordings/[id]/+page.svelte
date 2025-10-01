<script lang="ts">
	import EventCard from "$lib/components/events/EventCard.svelte";
	import RecordingCard from "$lib/components/events/RecordingCard.svelte";

	import Nav from "$lib/components/layout/nav.svelte";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Separator } from "$lib/components/ui/separator/index.js";
	import { getRecordingContext } from "$lib/context/recording.svelte";
	import { stopRecording } from "$lib/utils/recording";
	import type { PageProps } from "./$types";

	import { eventTypeColors } from "$lib/components/events/colors";
	import { pb } from "$lib/pocketbase";
	import { getRelativeDuration } from "$lib/utils/calculateRelativeDuration";
	import { createNewEvent } from "$lib/utils/events";
	import Ban from "@lucide/svelte/icons/ban";
	import Info from "@lucide/svelte/icons/info";
	import TriangleAlert from "@lucide/svelte/icons/triangle-alert";
	import { DateTime } from "luxon";
	import { onMount } from "svelte";

	let { data }: PageProps = $props();

	const recording = getRecordingContext();
	let events = $state(data.events);
	let loadedRecording = $state(data.recording);

	onMount(() => {
		pb.collection("event").subscribe("*", ({ action, record }) => {
			if (action === "create") events.push(record);
			if (action === "delete") events = data.events.filter((e) => e.id !== record.id);
			if (action === "update") events = data.events.map((e) => (e.id === record.id ? record : e));
		});

		pb.collection("recording").subscribe(loadedRecording.id, ({ action, record }) => {
			if (action === "update") loadedRecording = record;
		});

		return () => {
			pb.collection("event").unsubscribe("*");
			pb.collection("recording").unsubscribe("*");
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
		{#if recording.active}
			<Button onclick={() => stopRecording(recording)} variant="outline" class="border-destructive bg-destructive text-white animate-pulse hover:text-destructive">Stop recording</Button>
		{/if}
		<Button variant="outline" href="/recordings">Back</Button>
	{/snippet}
</Nav>

<div class="w-2/3 mx-auto print:w-full">
	<div class="w-full flex flex-col gap-2">
		<RecordingCard>
			{#snippet left()}
				<span class="text-xl font-bold"> {loadedRecording.recording_name} </span>
			{/snippet}
			{#snippet center()}
				<span class="text-xl font-bold"> {loadedRecording.filename} </span>
			{/snippet}
			{#snippet right()}
				<span> {DateTime.fromSQL(loadedRecording.start).toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS)} </span>
			{/snippet}
		</RecordingCard>

		{@render separator()}

		<div class="flex flex-col gap-1">
			{#each events as event}
				<EventCard recording={loadedRecording} data={event} />
			{/each}
		</div>

		{@render separator()}

		{#if recording.active}
			<div class="flex">
				<div class="basis-48"></div>
				<div class="flex-1">
					<Button onclick={() => createNewEvent(loadedRecording.id, "info", DateTime.now())} size="icon" class={[eventTypeColors.info, "cursor-pointer"]}><Info /></Button>
					<Button onclick={() => createNewEvent(loadedRecording.id, "warning", DateTime.now())} size="icon" class={[eventTypeColors.warning, "cursor-pointer"]}><TriangleAlert /></Button>
					<Button onclick={() => createNewEvent(loadedRecording.id, "error", DateTime.now())} size="icon" class={[eventTypeColors.error, "cursor-pointer"]}><Ban /></Button>
				</div>
			</div>
		{:else}
			<RecordingCard>
				{#snippet left()}
					<span class="text-xl font-bold"> Recording end </span>
				{/snippet}
				{#snippet center()}
					<span class="text-xl font-bold"> {getRelativeDuration(DateTime.fromSQL(loadedRecording.start), DateTime.fromSQL(loadedRecording.stop)).toFormat("hh:mm:ss")}</span>
				{/snippet}
				{#snippet right()}
					<span> {DateTime.fromSQL(loadedRecording.stop).toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS)} </span>
				{/snippet}
			</RecordingCard>
		{/if}
	</div>
</div>
