<script lang="ts">
	import { RecordingController, setRecordingControllerCtx } from "$lib/context/recordingController.svelte";
	import { Toaster } from "$lib/components/ui/sonner/index.js";
	import type { LayoutProps } from "./$types";

	let { data, children }: LayoutProps = $props();

	setRecordingControllerCtx(new RecordingController());
</script>

<Toaster richColors />

{@render children()}
