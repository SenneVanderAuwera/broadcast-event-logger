import { invalidateAll } from "$app/navigation";
import { pb } from "$lib/pocketbase";
import type { RecordingResponse } from "$lib/pocketbase/types";
import { getContext, onMount, setContext } from "svelte";

class RecordingState {
	recordings: RecordingResponse[] = $state([]);
	activeRecording: RecordingResponse | null = $derived.by(() => {
		if (!this.recordings) return null;
		return this.recordings.find((r) => !r.stop) || null;
	});

	constructor() {
		onMount(() => {
			pb.collection("recording").subscribe("*", (e) => {
				invalidateAll();
			});

			return () => {
				pb.collection("recording").unsubscribe("*");
			};
		});
	}

	init(records: RecordingResponse[]) {
		this.recordings = records;
	}

	async start() {
		try {
			const recordingResponse = await fetch("/api/recording/start", { method: "POST", body: "{}" });
		} catch (err) {
			throw err;
		}
	}

	async stop() {
		try {
			const recordingResponse = await fetch("/api/recording/stop", { method: "POST", body: "{}" });
			this.clear();
		} catch (err) {
			throw err;
		}
	}

	isActive() {
		return this.activeRecording !== null;
	}

	clear() {
		this.activeRecording = null;
	}
}

const RECORDING_CTX = Symbol("recording");

export function createRecordingContext() {
	const recording = new RecordingState();
	setContext(RECORDING_CTX, recording);

	return recording;
}

export function getRecordingContext() {
	return getContext<ReturnType<typeof createRecordingContext>>(RECORDING_CTX);
}
