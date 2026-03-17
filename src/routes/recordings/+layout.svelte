<script lang="ts">
	import { RecordingController, setRecordingControllerCtx } from "$lib/context/recordingController.svelte";
	import type { LayoutProps } from "./$types";

	let { data, children }: LayoutProps = $props();

	let recordingController = setRecordingControllerCtx(new RecordingController());

	$effect(() => {
		recordingController.recordings = data.recordings;
	});
</script>

{@render children()}
