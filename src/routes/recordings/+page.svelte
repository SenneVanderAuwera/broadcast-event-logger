<script lang="ts">
	import { RecordingsState } from "#lib/state/recordings.svelte.ts";
	import RecordingCard from "./components/recording-card.svelte";

	import Nav from "#lib/components/layout/nav.svelte";
	import { Button } from "#lib/components/ui/button/index.js";
	import { Checkbox } from "#lib/components/ui/checkbox/index.js";
	import { Label } from "#lib/components/ui/label/index.js";
	import Archive from "@lucide/svelte/icons/archive";
	import { goto } from "$app/navigation";
	import { onMount, tick } from "svelte";
	import { Collections } from "#lib/pocketbase/types.ts";
	import { pb } from "#lib/pocketbase/index.svelte.ts";

	const recordingsState = new RecordingsState();

	let selected: boolean[] = $derived(recordingsState.recordings.map((r) => r.selected));
	let hasSelection = $derived(selected.some(Boolean));
	let allSelected = $derived(recordingsState.recordings.length > 0 && selected.length === recordingsState.recordings.length && selected.every(Boolean));
	let someSelected = $derived(hasSelection && !allSelected);

	$effect(() => {
		pb.collection(Collections.Recordings).subscribe("*", ({ action, record }) => {
			recordingsState.recordingsQuery.refresh();
			console.log($state.snapshot(recordingsState.recordings));
		});

		return () => {
			pb.collection(Collections.Recordings).unsubscribe();
		};
	});

	const toggleSelectAll = () => {
		recordingsState.recordings.forEach((recording, i) => {
			recording.selected = !allSelected;
		});
	};

	const archiveSelected = async () => {
		const toArchive = recordingsState.recordings.filter((_, i) => selected[i]);
		if (toArchive.length === 0) return;

		const batch = pb.createBatch();
		for (const recording of toArchive) {
			batch.collection(Collections.Recordings).update(recording.record.id, { archived: true });
		}
		await batch.send();
		recordingsState.recordingsQuery.refresh();
	};

	const startNewRecording = async () => {
		try {
			const r = await recordingsState.startRecording();
			await tick();
			await goto(`/recordings/${r.id}`);
		} catch (err) {
			console.error(err);
		}
	};
</script>

<Nav>
	{#snippet right()}
		{#if recordingsState.active}
			<Button href={`/recordings/${recordingsState.active.record.id}`} variant="destructive" class="hover:bg-destructive/80">Go to active recording</Button>
		{:else}
			<Button variant="outline" class="border-destructive text-destructive hover:bg-destructive hover:text-white hover:cursor-pointer" onclick={startNewRecording}>Start new recording</Button>
		{/if}
		<Button href="/recordings/archive" variant="outline"><Archive /></Button>
	{/snippet}
</Nav>

<div class="w-2/3 mx-auto">
	{#if recordingsState.recordings.length > 0}
		<div class="flex items-center gap-2 mb-2 px-1 h-8">
			<Label>
				<Checkbox checked={allSelected} indeterminate={someSelected} onCheckedChange={toggleSelectAll} aria-label="Select all recordings" />

				<span class="text-sm text-muted-foreground">Select all</span>
			</Label>
			{#if hasSelection}
				<Button variant="destructive" size="sm" class="hover:bg-destructive/80 hover:cursor-pointer" onclick={archiveSelected}>
					<Archive />
					Archive selected
				</Button>
			{/if}
		</div>
	{/if}
	<div class="w-full mx-auto flex flex-col gap-2">
		{#each recordingsState.recordings as recording, i (recording.record.id)}
			<RecordingCard data={recording}></RecordingCard>
		{/each}
	</div>
</div>
