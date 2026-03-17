<script lang="ts">
	import { RecordingController, setRecordingControllerCtx } from "$lib/context/recordingController.svelte";
	import type { LayoutProps } from "./$types";

	let { data, children }: LayoutProps = $props();

	setRecordingControllerCtx(new RecordingController());
</script>

{@render children()}
