<script lang="ts">
	import { setRecordingControllerCtx } from "$lib/context/recordingController.svelte";
	import type { LayoutProps } from "./$types";
	import { getRecordings } from "./data.remote";

	let { data, children }: LayoutProps = $props();

	let recordingController = setRecordingControllerCtx();

	const recordings = await getRecordings();
	recordingController.setRecordings(recordings);
</script>

{@render children()}
