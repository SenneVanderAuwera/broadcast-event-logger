<script lang="ts">
	import "../app.css";
	import favicon from "$lib/assets/favicon.svg";
	import { createRecordingContext } from "$lib/context/recording.svelte";

	let { children } = $props();

	// Create the recording context
	createRecordingContext();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
