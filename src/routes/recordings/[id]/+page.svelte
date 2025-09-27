<script lang="ts">
	import EventCard from "$lib/components/events/EventCard.svelte";

	import Nav from "$lib/components/layout/nav.svelte";
	import { Button } from "$lib/components/ui/button/index.js";
	import type { PageProps } from "./$types";

	let { data }: PageProps = $props();
</script>

<Nav>
	{#snippet right()}
		<Button href="#" variant="outline" class="border-destructive bg-destructive text-white animate-pulse hover:text-destructive">Stop recording</Button>
		<Button variant="outline" href="/recordings">Back</Button>
	{/snippet}
</Nav>

<div class="w-2/3 mx-auto">
	<div class="w-full flex flex-col">
		<EventCard type="warning"></EventCard>
	</div>
</div>
