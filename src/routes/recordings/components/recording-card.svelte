<script lang="ts">
	import { Button } from "#lib/components/ui/button/index.js";
	import { Checkbox } from "#lib/components/ui/checkbox/index.js";
	import { pb } from "#lib/pocketbase/index.svelte.js";
	import { Collections } from "#lib/pocketbase/types.js";
	import type { RecordingRecord } from "#lib/state/recordings.svelte.ts";
	import { invalidate } from "$app/navigation";
	import Archive from "@lucide/svelte/icons/archive";
	import ArchiveRestore from "@lucide/svelte/icons/archive-restore";
	import { DateTime } from "luxon";

	let { data }: { data: RecordingRecord } = $props();
	async function archiveRecording() {
		await pb.collection(Collections.Recordings).update(data.record.id, { archived: true });
		invalidate("recordings:non-archived");
	}

	async function restoreRecording() {
		await pb.collection(Collections.Recordings).update(data.record.id, { archived: false });
		invalidate("recordings:archived");
	}
</script>

<div class="flex items-center gap-2 group relative">
	{#if !data.record.archived}
		<div class="flex items-center">
			<Checkbox bind:checked={data.selected} aria-label="Select recording" />
		</div>
	{/if}

	<div class="flex-1">
		<a href={`/recordings/${data.record.id}`}>
			<div class={["flex justify-between items-center p-4 rounded-md shadow-lg border", { "animate-pulse bg-destructive text-white": !data.record.stop }]}>
				<span>{data.record.recording_name}</span>
				<span>{data.record.filename}</span>
				<span>{DateTime.fromSQL(data.record.start).toLocaleString(DateTime.DATETIME_MED)}</span>
			</div>
		</a>
	</div>

	<div class="min-w-12">
		<div class="hidden group-hover:block">
			{#if data.record.archived}
				<Button variant="outline" size="icon" class="hover:cursor-pointer" onclick={restoreRecording}><ArchiveRestore /></Button>
			{:else}
				<Button variant="destructive" size="icon" class="hover:cursor-pointer" onclick={archiveRecording}><Archive /></Button>
			{/if}
		</div>
	</div>
</div>
