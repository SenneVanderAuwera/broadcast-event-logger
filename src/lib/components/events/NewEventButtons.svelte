<script lang="ts">
	import { eventStyles } from "#lib/components/events/colors.js";
	import { Button } from "#lib/components/ui/button/index.js";
	import { RecordingEventsTypeOptions } from "#lib/pocketbase/types.ts";
	import { createNewEvent } from "#lib/utils/events.js";
	import Ban from "@lucide/svelte/icons/ban";
	import Info from "@lucide/svelte/icons/info";
	import TriangleAlert from "@lucide/svelte/icons/triangle-alert";
	import { DateTime } from "luxon";

	let { recordingId }: { recordingId: string } = $props();

	function createEvent(type: RecordingEventsTypeOptions) {
		return createNewEvent(recordingId, type, DateTime.now());
	}
</script>

<div class="flex">
	<div class="basis-48"></div>
	<div class="flex-1">
		<Button onclick={() => createEvent(RecordingEventsTypeOptions.info)} size="icon" class={[eventStyles.default.info, eventStyles.hover.info, "cursor-pointer"]}><Info /></Button>
		<Button onclick={() => createEvent(RecordingEventsTypeOptions.warning)} size="icon" class={[eventStyles.default.warning, eventStyles.hover.warning, "cursor-pointer"]}><TriangleAlert /></Button>
		<Button onclick={() => createEvent(RecordingEventsTypeOptions.error)} size="icon" class={[eventStyles.default.error, eventStyles.hover.error, "cursor-pointer"]}><Ban /></Button>
	</div>
</div>
