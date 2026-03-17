<script lang="ts">
	import { Input } from "$lib/components/ui/input/index.js";
	import { Button } from "$lib/components/ui/button/index.js";

	import type { RecordingEventsResponse } from "$lib/pocketbase/types";
	import { eventStyles } from "./colors";
	import { tick } from "svelte";

	type Props = {
		event: RecordingEventsResponse;
		className?: string;
	};

	let button = $state<HTMLButtonElement | null>(null);
	let input = $state<HTMLInputElement | null>(null);

	let { event = $bindable(), className = "" }: Props = $props();

	let edit = $state(false);

	async function handleButtonClick() {
		edit = true;

		await tick();
		input?.focus();
		input?.select();
	}
</script>

{#if edit === true}
	<Input bind:ref={input} class="bg-white/20 w-44" bind:value={event.title} onfocusout={() => (edit = false)} />
{:else}
	<Button bind:ref={button} onclick={handleButtonClick} variant="ghost" class={[eventStyles["print"][event.type], className]}>{event.title}</Button>
{/if}
