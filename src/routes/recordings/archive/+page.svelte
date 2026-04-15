<script lang="ts">
	import Nav from "$lib/components/layout/nav.svelte";
	import RecordingCard from "../components/recording-card.svelte";

	import { Button } from "$lib/components/ui/button/index.js";

	import type { PageProps } from "./$types";

	let { data }: PageProps = $props();

	let selected: boolean[] = $state((() => data.recordings.map(() => false))());

	$effect(() => {
		if (selected.length !== data.recordings.length) {
			selected = data.recordings.map(() => false);
		}
	});
</script>

<Nav>
	{#snippet right()}
		<Button href="/recordings">Back</Button>
	{/snippet}
</Nav>

<div class="w-2/3 mx-auto">
	<div class="w-full mx-auto flex flex-col gap-2">
		{#each data.recordings as recording, i}
			<RecordingCard data={recording} archived bind:selected={selected[i]}></RecordingCard>
		{/each}
	</div>
</div>
