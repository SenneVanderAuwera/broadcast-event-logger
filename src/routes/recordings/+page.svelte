<script lang="ts">
	import RecordingCard from "./components/recording-card.svelte";

	import Nav from "$lib/components/layout/nav.svelte";
	import { Button } from "$lib/components/ui/button/index.js";
	import Archive from "@lucide/svelte/icons/archive";
	import type { PageProps } from "./$types";
	import { pb } from "$lib/pocketbase";
	import { goto } from "$app/navigation";

	let { data }: PageProps = $props();

	async function startRecording() {
		try {
			const recordingResponse = await pb.collection("recording").create({ start: new Date().toISOString() });
			goto(`/recordings/${recordingResponse.id}`);
		} catch (err) {
			console.error("Error creating recording");
		}
	}
</script>

<Nav>
	{#snippet right()}
		<Button onclick={startRecording} variant="outline" class="border-destructive text-destructive hover:bg-destructive hover:text-white">Start new recording</Button>
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
