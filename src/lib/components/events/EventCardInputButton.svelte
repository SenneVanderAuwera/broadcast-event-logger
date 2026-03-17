<script lang="ts">
	import { Input } from "$lib/components/ui/input/index.js";
	import { Button } from "$lib/components/ui/button/index.js";

	import { Collections, type RecordingEventsResponse } from "$lib/pocketbase/types";
	import { eventStyles } from "./colors";
	import { tick } from "svelte";
	import { pb } from "$lib/pocketbase";
	import type { ClassValue } from "clsx";

	type Props = {
		event: RecordingEventsResponse;
		buttonClass?: ClassValue;
		inputClass?: ClassValue;
	};

	let button = $state<HTMLButtonElement | null>(null);
	let input = $state<HTMLInputElement | null>(null);

	let { event = $bindable(), buttonClass = "", inputClass = "" }: Props = $props();

	let edit = $state(false);

	// BUTTON

	async function handleButtonClick() {
		edit = true;

		await tick();
		input?.focus();
		input?.select();
	}

	// INPUT

	async function handleInputFocusOut() {
		edit = false;
	}

	async function handleInputChange() {
		await pb.collection(Collections.RecordingEvents).update(event.id, { ...event });
	}
</script>

{#if edit === true}
	<Input bind:ref={input} class={["bg-white/20 w-44", inputClass]} bind:value={event.title} onfocusout={handleInputFocusOut} onchange={handleInputChange} />
{:else}
	<Button bind:ref={button} onclick={handleButtonClick} variant="ghost" class={[eventStyles["print"][event.type], buttonClass]}>{event.title}</Button>
{/if}
