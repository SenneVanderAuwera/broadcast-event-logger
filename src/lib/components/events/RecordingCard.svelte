<script lang="ts">
	import type { RecordingResponse } from "$lib/pocketbase/types";
	import { DateTime } from "luxon";

	let { data }: { data: RecordingResponse } = $props();

	let color = "bg-purple-700 text-white";
</script>

<div class="flex items-center">
	<div class="basis-48 print:basis-0"></div>
	<div class={["rounded-lg shadow-md p-4 space-y-3 flex-1 print:border-8 print:shadow-none", color]}>
		<header class="flex justify-between">
			<span class="text-xl font-bold"> {data.recording_name} </span>
			<span> {DateTime.fromSQL(data.start).toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS)} </span>
		</header>
	</div>
</div>
