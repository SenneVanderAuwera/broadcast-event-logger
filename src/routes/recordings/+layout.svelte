<script lang="ts">
	import { createRecordingContext } from "$lib/context/recording.svelte";
	import type { LayoutProps } from "./$types";

	let { data, children }: LayoutProps = $props();

	// Create the recording context
	const recordingState = createRecordingContext();

	$effect(() => {
		recordingState.init(data.recordings);
	});
</script>

{@render children()}
