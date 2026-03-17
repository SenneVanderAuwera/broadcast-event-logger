<script lang="ts">
	import RecordingCard from "./components/recording-card.svelte";

	import Nav from "$lib/components/layout/nav.svelte";
	import { Button } from "$lib/components/ui/button/index.js";
	import { getRecordingControllerCtx } from "$lib/context/recordingController.svelte";
	import Archive from "@lucide/svelte/icons/archive";
	import type { PageProps } from "./$types";

	let { data }: PageProps = $props();

	const recordingController = getRecordingControllerCtx();

	$effect(() => {
		recordingController.recordings = data.recordings;
	});

	async function startNewRecording() {
		const r = await recordingController.startRecording();
		window.location.href = `/recordings/${r.id}`;
	}
</script>

<Nav>
	{#snippet right()}
		{#if recordingController.data.active}
			<Button href={`/recordings/${recordingController.data.record?.id}`} variant="destructive" class="hover:bg-destructive/80">Go to active recording</Button>
		{:else}
			<Button variant="outline" class="border-destructive text-destructive hover:bg-destructive hover:text-white hover:cursor-pointer" onclick={startNewRecording}>Start new recording</Button>
		{/if}
		<Button href="/recordings/archive" variant="outline"><Archive /></Button>
	{/snippet}
</Nav>

<div class="w-2/3 mx-auto">
	<div class="w-full mx-auto flex flex-col gap-2 mt-10">
		{#each data.recordings as recording}
			<RecordingCard data={recording}></RecordingCard>
		{/each}
	</div>
</div>
