<script lang="ts">
	import { invalidate } from "$app/navigation";
	import { setRecordingControllerCtx } from "$lib/context/recordingController.svelte";
	import type { LayoutProps } from "./$types";

	let { data, children }: LayoutProps = $props();

	let recordingController = setRecordingControllerCtx(data.recordings);
	$effect(() => {
		recordingController.recordings = data.recordings;
	});
</script>

{@render children()}
