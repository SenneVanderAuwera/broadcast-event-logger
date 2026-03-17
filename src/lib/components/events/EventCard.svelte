<script lang="ts">
	import { invalidateAll } from "$app/navigation";
	import { pb } from "$lib/pocketbase";
	import { Collections, type RecordingEventsResponse, type RecordingsResponse } from "$lib/pocketbase/types";
	import { getRelativeDuration } from "$lib/utils/calculateRelativeDuration";
	import { DateTime } from "luxon";
	import { toast } from "svelte-sonner";
	import { slide } from "svelte/transition";
	import { eventStyles } from "./colors";
	import EventCardInput from "./HoverInput.svelte";

	let { event = $bindable(), recording }: { event: RecordingEventsResponse; recording: RecordingsResponse } = $props();

	const type: "info" | "warning" | "error" = $derived(event.type as "info" | "warning" | "error");

	let color = $derived(eventStyles["default"][type]);
	let duration = $derived(getRelativeDuration(DateTime.fromSQL(recording.start), DateTime.fromSQL(event.timestamp)));

	let isHovered = $state(false);

	function handleMouseEnter() {
		isHovered = true;
	}

	function handleMouseLeave() {
		isHovered = false;
	}

	async function handleInputChange() {
		try {
			await pb.collection(Collections.RecordingEvents).update(event.id, { ...event });
		} catch (err) {
			toast.error("Failed to update event title");
			console.error(err);
			invalidateAll();
		}
	}
</script>

<div role="listitem" class="flex items-center border shadow-md rounded-lg print:border-2 print:shadow-none" onmouseenter={handleMouseEnter} onmouseleave={handleMouseLeave}>
	<div class="hidden print:block ms-2 size-8 border-2 rounded-md"></div>
	<div class="basis-48 text-center">{duration.toFormat("hh:mm:ss")}</div>

	<div class={["rounded-lg px-3 py-3 space-y-3 flex-1 print:p-1 print:bg-transparent print:text-foreground", color]}>
		<header class="flex justify-between mb-0 items-center">
			<EventCardInput className={"bg-transparent! border-0 text-lg! font-bold px-1 hover:bg-white/20! w-44 focus-visible:ring-0"} bind:value={event.title} onchange={handleInputChange} />
			<span class=""> {DateTime.fromSQL(event.timestamp).toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS)} </span>
		</header>

		{#if event.message !== "" || isHovered}
			<p transition:slide={{ duration: 250 }} class="text-sm whitespace-pre-wrap">
				<EventCardInput className={"bg-transparent! border-0 text-lg! px-1 hover:bg-white/20! focus-visible:ring-0"} bind:value={event.message} onchange={handleInputChange} />
			</p>
		{/if}
	</div>
</div>
