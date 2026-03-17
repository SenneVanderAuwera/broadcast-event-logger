<script lang="ts">
	import { setRecordingControllerCtx } from "$lib/context/recordingController.svelte";
	import type { LayoutProps } from "./$types";

	let { data, children }: LayoutProps = $props();

	let recordingController = $derived(setRecordingControllerCtx(data.recordings));
	$effect(() => {
		recordingController.recordings = data.recordings;
	});
</script>

{@render children()}
