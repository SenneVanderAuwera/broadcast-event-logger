<script lang="ts">
	import { Textarea } from "$lib/components/ui/textarea/index.js";

	import type { ClassValue } from "clsx";
	import { onMount } from "svelte";

	type Props = {
		value: string;
		className?: ClassValue;
		onchange?: () => void;
	};
	let { value = $bindable(), className = "", onchange }: Props = $props();

	let textarea = $state<HTMLTextAreaElement | null>(null);

	// INPUT
	function handleInputFocus() {
		textarea?.select();
	}

	async function handleEnterKey(event: KeyboardEvent) {
		if (event.key === "Enter") {
			textarea?.blur();
		}
	}

	function autoHeight() {
		if (textarea) {
			textarea.style.height = textarea.scrollHeight + "px";
		}
	}

	onMount(() => {
		autoHeight();
	});
</script>

<Textarea oninput={autoHeight} cols={1} bind:ref={textarea} class={[className]} bind:value onfocuscapture={handleInputFocus} {onchange} onkeydown={handleEnterKey} />
