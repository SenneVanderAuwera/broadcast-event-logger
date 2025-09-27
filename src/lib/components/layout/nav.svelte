<script lang="ts">
	import type { Snippet } from "svelte";

	let { left, right }: { left?: Snippet; right?: Snippet } = $props();
</script>

<nav class="w-2/3 mx-auto flex justify-between p-2 print:hidden">
	<div class="flex-1 justify-start gap-1">
		{@render left?.()}
	</div>

	<div class="flex flex-1 justify-end gap-1">
		{@render right?.()}
	</div>
</nav>
