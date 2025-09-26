<script lang="ts">
	import Nav from "$lib/components/layout/nav.svelte";
	import type { PageProps } from "./$types";

	let { data }: PageProps = $props();
</script>

<Nav>
	{#snippet right()}
		Hello
	{/snippet}
</Nav>
