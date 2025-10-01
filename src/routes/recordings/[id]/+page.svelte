<script lang="ts">
	import EventCard from "$lib/components/events/EventCard.svelte";
	import RecordingCard from "$lib/components/events/RecordingCard.svelte";

	import Nav from "$lib/components/layout/nav.svelte";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Separator } from "$lib/components/ui/separator/index.js";
	import { getRecordingContext } from "$lib/context/recording.svelte";
	import { stopRecording } from "$lib/utils/recording";
	import type { PageProps } from "./$types";

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
		<Button onclick={() => stopRecording(recording)} variant="outline" class="border-destructive bg-destructive text-white animate-pulse hover:text-destructive">Stop recording</Button>
		<Button variant="outline" href="/recordings">Back</Button>
	{/snippet}
</Nav>

<div class="w-2/3 mx-auto print:w-full">
	<div class="w-full flex flex-col gap-2">
		<RecordingCard></RecordingCard>

		{@render separator()}

		<div class="flex flex-col gap-1">
			<EventCard type="warning"></EventCard>
			<EventCard type="info"></EventCard>
			<EventCard type="danger"></EventCard>
		</div>

		{@render separator()}
	</div>
</div>
