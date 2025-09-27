<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import Archive from "@lucide/svelte/icons/archive";

	let { active = false } = $props();
	let card: HTMLDivElement;
</script>

<div class="flex items-center gap-2 group relative ms-12">
	<div class="flex-1">
		<a href="##">
			<div class={["flex justify-between items-center p-4 rounded-md shadow-lg border", { "animate-pulse bg-destructive text-white": active }]}>
				<span>Recording name</span>
				<span>File name</span>
				<span>Date 00:00:00 UTC</span>
			</div>
		</a>
	</div>

	<div class="min-w-12">
		<div class="hidden group-hover:block">
			<Button variant="destructive" size="icon" class="hover:cursor-pointer"><Archive /></Button>
		</div>
	</div>
</div>
