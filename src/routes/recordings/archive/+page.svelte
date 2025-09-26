<script lang="ts">
	import Nav from "$lib/components/layout/nav.svelte";

	import { Button } from "$lib/components/ui/button/index.js";

	import type { PageProps } from "./$types";

	let { data }: PageProps = $props();
</script>

<Nav>
	{#snippet right()}
		<Button href="/recordings">Back</Button>
	{/snippet}
</Nav>
