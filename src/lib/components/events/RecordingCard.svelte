<script lang="ts">
	let color = "bg-purple-700 text-white";
</script>

<div class="flex items-center">
	<div class="basis-48 print:basis-0"></div>
	<div class={["rounded-lg shadow-md p-4 space-y-3 flex-1 print:border-8 print:shadow-none", color]}>
		<header class="flex justify-between">
			<span class="text-xl font-bold"> Event title </span>
			<span> Event date </span>
		</header>
	</div>
</div>
