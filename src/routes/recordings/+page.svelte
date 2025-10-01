<script lang="ts">
	import RecordingCard from "./components/recording-card.svelte";

	import { goto } from "$app/navigation";
	import Nav from "$lib/components/layout/nav.svelte";
	import { Button } from "$lib/components/ui/button/index.js";
	import { getRecordingContext } from "$lib/context/recording.svelte";
	import { pb } from "$lib/pocketbase";
	import Archive from "@lucide/svelte/icons/archive";
	import type { PageProps } from "./$types";

	let { data }: PageProps = $props();

	const recording = getRecordingContext();
	recording.init(data.activeRecording);

	async function startRecording() {
		try {
			const recordingResponse = await pb.collection("recording").create({ start: new Date().toISOString() });
			recording.init(recordingResponse);
			goto(`/recordings/${recordingResponse.id}`);
		} catch (err) {
			console.error("Error creating recording");
		}
	}
</script>

<Nav>
	{#snippet right()}
		{#if recording.active}
			<Button href={`/recordings/${data.activeRecording.id}`} variant="destructive" class="hover:bg-destructive/80">Go to active recording</Button>
		{:else}
			<Button onclick={startRecording} variant="outline" class="border-destructive text-destructive hover:bg-destructive hover:text-white">Start new recording</Button>
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
