<script lang="ts">
	import { Input } from "$lib/components/ui/input/index.js";
	import { pb } from "$lib/pocketbase";
	import { Collections, type RecordingEventsResponse } from "$lib/pocketbase/types";
	import type { ClassValue } from "clsx";

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

	async function handleInputChange() {
		await pb.collection(Collections.RecordingEvents).update(event.id, { ...event });
	}
</script>

<Input bind:ref={input} class={[className]} bind:value={event.title} onfocuscapture={handleInputFocus} onchange={handleInputChange} />
