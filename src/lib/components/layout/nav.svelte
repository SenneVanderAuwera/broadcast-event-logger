<script lang="ts">
	import type { Snippet } from "svelte";

	let { left, right }: { left?: Snippet; right?: Snippet } = $props();
</script>

<nav class="w-2/3 mx-auto flex justify-between">
	<div class="flex-1 justify-start">
		{@render left?.()}
	</div>

	<div class="flex flex-1 justify-end">
		{@render right?.()}
	</div>
</nav>
