<script lang="ts">
	import { Input } from "$lib/components/ui/input/index.js";
	import type { ClassValue } from "clsx";

	type Props = {
		value: string;
		className?: ClassValue;
		onchange?: () => void;
	};
	let { value = $bindable(), className = "", onchange }: Props = $props();

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
</script>

<Input bind:ref={input} class={[className]} bind:value onfocuscapture={handleInputFocus} {onchange} onkeydown={handleEnterKey} />
