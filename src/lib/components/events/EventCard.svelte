<script lang="ts">
	import { refreshAll } from "$app/navigation";
	import { pb } from "#lib/pocketbase/index.ts";
	import { Collections, type RecordingEventsResponse, type RecordingsResponse } from "#lib/pocketbase/types.ts";
	import { getRelativeDuration } from "#lib/utils/calculateRelativeDuration.ts";
	import { DateTime } from "luxon";
	import { toast } from "svelte-sonner";
	import { slide } from "svelte/transition";
	import { eventStyles } from "./colors";
	import HoverInput from "./HoverInput.svelte";
	import HoverTextarea from "./HoverTextarea.svelte";
	import { parseColor } from "#lib/utils/color-parser.ts";
	import { Button } from "#lib/components/ui/button/index.js";

	let { event = $bindable(), recording }: { event: RecordingEventsResponse; recording: RecordingsResponse } = $props();

	const disabled = $derived(recording.archived ?? false);

	const type: "info" | "warning" | "error" = $derived(event.type as "info" | "warning" | "error");

	let color = $derived(parseColor(event.color));
	const defaultColors = { info: "#1447e6", warning: "#d08700", error: "#c10007" };

	let duration = $derived(getRelativeDuration(DateTime.fromSQL(recording.start), DateTime.fromSQL(event.timestamp_in)));

	let isHovered = $state(false);
	let ending = $state(false);

	function handleMouseEnter() {
		isHovered = true;
	}

	function handleMouseLeave() {
		isHovered = false;
	}

	async function handleInputChange() {
		try {
			await pb.collection(Collections.RecordingEvents).update(event.id, {
				title: event.title,
				message: event.message,
				color: event.color,
			});
		} catch (err) {
			toast.error("Failed to update event");
			console.error(err);
			await refreshAll();
		}
	}

	async function endEvent() {
		ending = true;
		try {
			const response = await fetch(`/api/event/${encodeURIComponent(event.id)}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ timestamp_out: new Date().toISOString() }),
			});
			const result: { message: string; data?: RecordingEventsResponse } = await response.json();
			if (!response.ok || !result.data) throw new Error(result.message || "Failed to end event");
			event.timestamp_out = result.data.timestamp_out;
		} catch (err) {
			console.error("Failed to end event:", err);
			toast.error(err instanceof Error ? err.message : "Failed to end event");
		} finally {
			ending = false;
		}
	}
</script>

<div role="listitem" class="group flex items-center border shadow-md rounded-lg print:border-2 print:shadow-none" onmouseenter={handleMouseEnter} onmouseleave={handleMouseLeave}>
	<div class="hidden print:block ms-2 size-8 border-2 rounded-md"></div>
	<div class="basis-48 text-center">{duration.toFormat("hh:mm:ss")}</div>

	<div class={["rounded-lg px-3 py-3 space-y-3 flex-1 print:p-1 print:bg-transparent print:text-foreground", color ? "bg-(--event-color)" : eventStyles["default"][type]]} style:--event-color={color}>
		<header class="flex justify-between mb-0 items-center">
			<HoverInput className={"bg-transparent! border-0 text-lg! font-bold px-1 hover:bg-black/20! w-44 focus-visible:ring-0"} bind:value={event.title} onchange={handleInputChange} {disabled} />
			<div class="flex items-center gap-2">
				{#if !disabled}
					<input type="color" aria-label="Event color" class="size-8 cursor-pointer print:hidden" bind:value={() => color ?? defaultColors[type], (value) => (event.color = value)} onchange={handleInputChange} />
					<Button variant="default" size="sm" class="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100 print:hidden" disabled={ending} onclick={endEvent}
						>{event.timestamp_out ? "Update end" : "End event"}</Button
					>
				{/if}

				<span class="flex flex-col text-xs font-bold">
					<span>
						{DateTime.fromSQL(event.timestamp_in).toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS)}
					</span>
					<span>
						{#if event.timestamp_out}
							{DateTime.fromSQL(event.timestamp_out).toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS)}
						{/if}
					</span>
				</span>
			</div>
		</header>

		{#if event.message !== "" || (!disabled && isHovered)}
			<p transition:slide={{ duration: 250 }} class="text-sm whitespace-pre-wrap">
				<HoverTextarea className={"bg-transparent! border-0 text-lg! px-2 hover:bg-black/20! focus-visible:ring-0 min-h-10 h-10 resize-none"} bind:value={event.message} onchange={handleInputChange} {disabled} />
			</p>
		{/if}
	</div>
</div>
