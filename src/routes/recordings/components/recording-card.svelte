<script lang="ts">
	import { invalidate } from "$app/navigation";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Checkbox } from "$lib/components/ui/checkbox/index.js";
	import { pb } from "$lib/pocketbase";
	import { Collections } from "$lib/pocketbase/types";
	import Archive from "@lucide/svelte/icons/archive";
	import ArchiveRestore from "@lucide/svelte/icons/archive-restore";
	import type { PageData } from "../$types";
	import { DateTime } from "luxon";

	let { active = false, archived = false, data, selected = $bindable(false) }: { active?: boolean; archived?: boolean; data: PageData["recordings"][0]; selected: boolean } = $props();

	async function archiveRecording() {
		await pb.collection(Collections.Recordings).update(data.id, { archived: true });
		invalidate("recordings:non-archived");
	}

	async function restoreRecording() {
		await pb.collection(Collections.Recordings).update(data.id, { archived: false });
		invalidate("recordings:archived");
	}
</script>

<div class="flex items-center gap-2 group relative">
	{#if !archived}
		<div class="flex items-center">
			<Checkbox bind:checked={selected} aria-label="Select recording" />
		</div>
	{/if}

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
			{#if archived}
				<Button variant="outline" size="icon" class="hover:cursor-pointer" onclick={restoreRecording}><ArchiveRestore /></Button>
			{:else}
				<Button variant="destructive" size="icon" class="hover:cursor-pointer" onclick={archiveRecording}><Archive /></Button>
			{/if}
		</div>
	</div>
</div>
