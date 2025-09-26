<script lang="ts">
	import Nav from "$lib/components/layout/nav.svelte";
	import { Button } from "$lib/components/ui/button/index.js";
	import Archive from "@lucide/svelte/icons/archive";
	import type { PageProps } from "./$types";

	let { data }: PageProps = $props();
</script>

<Nav>
	{#snippet right()}
		<Button href="#" variant="destructive">Start new recording</Button>
		<Button href="/recordings/archive" variant="outline"><Archive /></Button>
	{/snippet}
</Nav>
