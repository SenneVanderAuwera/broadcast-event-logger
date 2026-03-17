<script lang="ts">
	import { invalidateAll } from "$app/navigation";
	import { Input } from "$lib/components/ui/input/index.js";
	import { pb } from "$lib/pocketbase";
	import { Collections, type RecordingEventsResponse } from "$lib/pocketbase/types";
	import type { ClassValue } from "clsx";
	import { toast } from "svelte-sonner";

	type Props = {
		event: RecordingEventsResponse;
		className?: ClassValue;
	};
	let { event = $bindable(), className = "" }: Props = $props();

	let input = $state<HTMLInputElement | null>(null);

	// INPUT
	function handleInputFocus() {
		input?.select();
	}

	async function handleEnterKey(event: KeyboardEvent) {
		if (event.key === "Enter") {
			input?.blur();
		}
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

<Input bind:ref={input} class={[className]} bind:value={event.title} onfocuscapture={handleInputFocus} onchange={handleInputChange} onkeydown={handleEnterKey} />
