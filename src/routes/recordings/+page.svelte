<script lang="ts">
	import RecordingCard from "./components/recording-card.svelte";

	import Nav from "$lib/components/layout/nav.svelte";
	import { Button } from "$lib/components/ui/button/index.js";
	import Archive from "@lucide/svelte/icons/archive";
	import type { PageProps } from "./$types";

	let { data }: PageProps = $props();

	let active = $state(false);
	$inspect(data.recordings);
</script>

<Nav>
	{#snippet right()}
		<Button href="#" variant="outline" class="border-destructive text-destructive hover:bg-destructive hover:text-white">Start new recording</Button>
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
