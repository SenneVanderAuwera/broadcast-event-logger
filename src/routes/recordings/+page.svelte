<script lang="ts">
	import RecordingCard from "./components/recording-card.svelte";

	import Nav from "$lib/components/layout/nav.svelte";
	import { Button } from "$lib/components/ui/button/index.js";
	import { getRecordingContext } from "$lib/context/recording.svelte";
	import Archive from "@lucide/svelte/icons/archive";

	const recordingState = getRecordingContext();
</script>

<Nav>
	{#snippet right()}
		{#if recordingState.isActive()}
			<Button href={`/recordings/${recordingState.id}`} variant="destructive" class="hover:bg-destructive/80">Go to active recording</Button>
		{:else}
			<Button onclick={recordingState.start} variant="outline" class="border-destructive text-destructive hover:bg-destructive hover:text-white">Start new recording</Button>
		{/if}
		<Button href="/recordings/archive" variant="outline"><Archive /></Button>
	{/snippet}
</Nav>

<div class="w-2/3 mx-auto">
	<div class="w-full mx-auto flex flex-col gap-2 mt-10">
		{#each recordingState.recordings as recording}
			<RecordingCard data={recording}></RecordingCard>
		{/each}
	</div>
</div>
