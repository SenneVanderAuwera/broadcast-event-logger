<script lang="ts">
	import { pb } from "#lib/pocketbase/index.svelte.js";
	import { Collections } from "#lib/pocketbase/types.js";
	import { getRelativeDuration } from "#lib/utils/calculateRelativeDuration.js";
	import { refreshAll } from "$app/navigation";
	import { DateTime } from "luxon";
	import { toast } from "svelte-sonner";
	import { slide } from "svelte/transition";
	import { eventStyles } from "./colors";
	import HoverInput from "./HoverInput.svelte";
	import HoverTextarea from "./HoverTextarea.svelte";
	import type { RecordingEventRecord, RecordingRecord } from "#lib/state/recordings.svelte.ts";

	const { recording, event }: { recording: RecordingRecord; event: RecordingEventRecord } = $props();

	const disabled = $derived(recording.record.archived ?? false);

	const type: "info" | "warning" | "error" = $derived(event.record.type as "info" | "warning" | "error");

	let color = $derived(eventStyles["default"][type]);
	let duration = $derived(getRelativeDuration(DateTime.fromSQL(recording.record.start), DateTime.fromSQL(event.record.timestamp)));

	let isHovered = $state(false);

	function handleMouseEnter() {
		isHovered = true;
	}

	function handleMouseLeave() {
		isHovered = false;
	}

	async function handleInputChange() {
		try {
			await pb.collection(Collections.RecordingEvents).update(event.record.id, { ...event.record });
		} catch (err) {
			toast.error("Failed to update event");
			console.error(err);
			refreshAll();
		}
	}
</script>

<div role="listitem" class="flex items-center border shadow-md rounded-lg print:border-2 print:shadow-none" onmouseenter={handleMouseEnter} onmouseleave={handleMouseLeave}>
	<div class="hidden print:block ms-2 size-8 border-2 rounded-md"></div>
	<div class="basis-48 text-center">{duration.toFormat("hh:mm:ss")}</div>

	<div class={["rounded-lg px-3 py-3 space-y-3 flex-1 print:p-1 print:bg-transparent print:text-foreground", color]}>
		<header class="flex justify-between mb-0 items-center">
			<HoverInput className={"bg-transparent! border-0 text-lg! font-bold px-1 hover:bg-white/20! w-44 focus-visible:ring-0"} bind:value={event.record.title} onchange={handleInputChange} {disabled} />
			<span class=""> {DateTime.fromSQL(event.record.timestamp).toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS)} </span>
		</header>

		{#if event.record.message !== "" || (!disabled && isHovered)}
			<p transition:slide={{ duration: 250 }} class="text-sm whitespace-pre-wrap">
				<HoverTextarea className={"bg-transparent! border-0 text-lg! px-2 hover:bg-white/20! focus-visible:ring-0 min-h-10 h-10 resize-none"} bind:value={event.record.message} onchange={handleInputChange} {disabled} />
			</p>
		{/if}
	</div>
</div>
