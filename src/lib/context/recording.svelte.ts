import { invalidateAll } from "$app/navigation";
import { pb } from "$lib/pocketbase";
import type { RecordingResponse } from "$lib/pocketbase/types";
import { getContext, onMount, setContext } from "svelte";

class Recording {
	id = $state("");
	recordings: RecordingResponse[] = $state([]);
	activeRecording: RecordingResponse | null = $derived(this.recordings.find((r) => !r.stop) || null);

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
		this.id = "";
	}
}

const RECORDING_CTX = Symbol("recording");

export function createRecordingContext(records: RecordingResponse[]) {
	const recording = new Recording();
	setContext(RECORDING_CTX, recording);

	if (records?.length > 0) {
		recording.init(records);
	}

	return recording;
}

export function getRecordingContext() {
	return getContext<ReturnType<typeof createRecordingContext>>(RECORDING_CTX);
}
