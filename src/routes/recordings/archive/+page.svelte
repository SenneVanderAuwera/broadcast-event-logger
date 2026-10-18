<script lang="ts">
	import Nav from "#lib/components/layout/nav.svelte";
	import RecordingCard from "../components/recording-card.svelte";

	import { Button } from "#lib/components/ui/button/index.js";
	import { RecordingsState } from "#lib/state/recordings.svelte.ts";

	const recordingState = new RecordingsState();
</script>

<Nav>
	{#snippet right()}
		<Button href="/recordings">Back</Button>
	{/snippet}
</Nav>

<div class="w-2/3 mx-auto">
	<div class="w-full mx-auto flex flex-col gap-2">
		{#each recordingState.recordings as recording, i}
			<RecordingCard data={recording} selected></RecordingCard>
		{/each}
	</div>
</div>
