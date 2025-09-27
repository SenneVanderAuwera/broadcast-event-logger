<script lang="ts">
	import { eventTypeColors } from "./colors";

	let { type = "info" }: { type?: "info" | "warning" | "danger" } = $props();

	let color = $derived(eventTypeColors[type]);
</script>

<div class="flex items-center">
	<div class="basis-48 text-center">timestamp</div>

	<div class={["rounded-lg shadow-md p-4 space-y-3 flex-1", color]}>
		<header class="flex justify-between">
			<span class="text-xl font-bold"> Event title </span>
			<span> Event date </span>
		</header>

		<p>
			Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatem quas inventore tempore voluptas temporibus consequuntur? Assumenda, et repellendus error eligendi voluptatibus magnam ab nobis provident, laudantium magni maxime? Ipsam,
			minima.
		</p>
	</div>
</div>
