<script lang="ts">
	import type { Snippet } from "svelte";

	let { left, center, right }: { left?: Snippet; center?: Snippet; right?: Snippet } = $props();

	let color = "bg-purple-700 text-white";
</script>

<div class="flex items-center">
	<div class="basis-48 print:basis-0"></div>
	<div class={["rounded-lg shadow-md p-4 space-y-3 flex-1 print:border-2 print:shadow-none print:bg-transparent print:text-foreground", color]}>
		<header class="flex justify-between">
			<span class="flex-1 text-start">{@render left?.()}</span>
			<span class="flex-1 text-center text-xl font-bold"> {@render center?.()}</span>
			<span class="flex-1 text-end"> {@render right?.()} </span>
		</header>
	</div>
</div>
