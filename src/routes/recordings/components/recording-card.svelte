<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import Archive from "@lucide/svelte/icons/archive";
	import type { PageData } from "../$types";
	import { DateTime } from "luxon";

	let { active = false, data }: { active?: boolean; data: PageData["recordings"][0] } = $props();
</script>

<div class="flex items-center gap-2 group relative ms-12">
	<div class="flex-1">
		<a href={`/recordings/${data.id}`}>
			<div class={["flex justify-between items-center p-4 rounded-md shadow-lg border", { "animate-pulse bg-destructive text-white": active }]}>
				<span>{data.recording_name}</span>
				<span>{data.filename}</span>
				<span>{DateTime.fromSQL(data.start).toLocaleString(DateTime.DATETIME_MED)}</span>
			</div>
		</a>
	</div>

	<div class="min-w-12">
		<div class="hidden group-hover:block">
			<Button variant="destructive" size="icon" class="hover:cursor-pointer"><Archive /></Button>
		</div>
	</div>
</div>
