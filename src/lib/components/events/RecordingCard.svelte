<script lang="ts">
	let color = "bg-purple-700 text-white";
</script>

<div class="flex items-center">
	<div class="basis-48"></div>
	<div class={["rounded-lg shadow-md p-4 space-y-3 flex-1", color]}>
		<header class="flex justify-between">
			<span class="text-xl font-bold"> Event title </span>
			<span> Event date </span>
		</header>
	</div>
</div>
