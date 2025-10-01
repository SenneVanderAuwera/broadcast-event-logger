<script lang="ts">
	import EventCard from "$lib/components/events/EventCard.svelte";
	import RecordingCard from "$lib/components/events/RecordingCard.svelte";

	import Nav from "$lib/components/layout/nav.svelte";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Separator } from "$lib/components/ui/separator/index.js";
	import { getRecordingContext } from "$lib/context/recording.svelte";
	import { stopRecording } from "$lib/utils/recording";
	import type { PageProps } from "./$types";

	import Info from "@lucide/svelte/icons/info";
	import TriangleAlert from "@lucide/svelte/icons/triangle-alert";
	import Ban from "@lucide/svelte/icons/ban";
	import { eventTypeColors } from "$lib/components/events/colors";

	let { data }: PageProps = $props();

	const recording = getRecordingContext();
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
		<RecordingCard data={data.recording}></RecordingCard>

		{@render separator()}

		<div class="flex flex-col gap-1">
			{#each data.events as event}
				<EventCard recording={data.recording} data={event} />
			{/each}
		</div>

		{@render separator()}

		<div class="flex">
			<div class="basis-48"></div>
			<div class="flex-1">
				<Button size="icon" class={[eventTypeColors.info]}><Info /></Button>
				<Button size="icon" class={[eventTypeColors.warning]}><TriangleAlert /></Button>
				<Button size="icon" class={[eventTypeColors.error]}><Ban /></Button>
			</div>
		</div>
	</div>
</div>
