<script lang="ts">
	import { Input } from "$lib/components/ui/input/index.js";
	import type { ClassValue } from "clsx";

	type Props = {
		value: string;
		className?: ClassValue;
		onchange?: () => void;
		disabled?: boolean;
	};
	let { value = $bindable(), className = "", onchange, disabled = false }: Props = $props();

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

<Input bind:ref={input} class={["disabled:text-current disabled:opacity-100 disabled:cursor-default", className]} bind:value onfocuscapture={handleInputFocus} {onchange} onkeydown={handleEnterKey} {disabled} />
