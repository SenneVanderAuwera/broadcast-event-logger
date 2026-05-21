<script lang="ts">
	import { invalidate, invalidateAll } from "$app/navigation";
	import RecordingCard from "./components/recording-card.svelte";

	import Nav from "$lib/components/layout/nav.svelte";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Checkbox } from "$lib/components/ui/checkbox/index.js";
	import { Label } from "$lib/components/ui/label/index.js";
	import { getRecordingControllerCtx } from "$lib/context/recordingController.svelte";
	import { pb } from "$lib/pocketbase";
	import { Collections } from "$lib/pocketbase/types";
	import Archive from "@lucide/svelte/icons/archive";
	import type { PageProps } from "./$types";
	import { onMount } from "svelte";

	let { data }: PageProps = $props();

	const recordingController = getRecordingControllerCtx();

	let selected: boolean[] = $state((() => data.recordings.map(() => false))());

	onMount(() => {
		pb.collection(Collections.Recordings).subscribe("*", async () => {
			await invalidateAll();
		});

		return () => {
			pb.collection(Collections.Recordings).unsubscribe("*");
		};
	});

	$effect(() => {
		recordingController.recordings = data.recordings;
		if (selected.length !== data.recordings.length) {
			selected = data.recordings.map(() => false);
		}
	});

	let hasSelection = $derived(selected.some(Boolean));
	let allSelected = $derived(data.recordings.length > 0 && selected.length === data.recordings.length && selected.every(Boolean));
	let someSelected = $derived(hasSelection && !allSelected);

	function toggleSelectAll() {
		if (allSelected) {
			selected = selected.map(() => false);
		} else {
			selected = selected.map(() => true);
		}
	}

	async function archiveSelected() {
		const toArchive = data.recordings.filter((_, i) => selected[i]);
		if (toArchive.length === 0) return;

		const batch = pb.createBatch();
		for (const recording of toArchive) {
			batch.collection(Collections.Recordings).update(recording.id, { archived: true });
		}
		await batch.send();
		invalidate("recordings:non-archived");
	}

	async function startNewRecording() {
		const r = await recordingController.startRecording();
		window.location.href = `/recordings/${r.id}`;
	}
</script>

<Nav>
	{#snippet right()}
		{#if recordingController.state.active}
			<Button href={`/recordings/${recordingController.state.record?.id}`} variant="destructive" class="hover:bg-destructive/80">Go to active recording</Button>
		{:else}
			<Button variant="outline" class="border-destructive text-destructive hover:bg-destructive hover:text-white hover:cursor-pointer" onclick={startNewRecording}>Start new recording</Button>
		{/if}
		<Button href="/recordings/archive" variant="outline"><Archive /></Button>
	{/snippet}
</Nav>

<div class="w-2/3 mx-auto">
	{#if data.recordings.length > 0}
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
		{#each data.recordings as recording, i (recording.id)}
			<RecordingCard data={recording} bind:selected={selected[i]}></RecordingCard>
		{/each}
	</div>
</div>
