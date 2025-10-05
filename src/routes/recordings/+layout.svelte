<script lang="ts">
	import { createRecordingContext } from "$lib/context/recording.svelte";
	import type { LayoutProps } from "./$types";

	let { data, children }: LayoutProps = $props();

	// Create the recording context
	createRecordingContext(data.recordings);
</script>

{@render children()}
