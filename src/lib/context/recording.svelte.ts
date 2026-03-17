import type { RecordingsResponse } from "$lib/pocketbase/types";
import { getContext, setContext } from "svelte";

class RecordingState {
	recordings: RecordingsResponse[] = $state([]);
	activeRecording: RecordingsResponse | null = $derived.by(() => {
		if (!this.recordings) return null;
		return this.recordings.find((r) => !r.stop) || null;
	});

	constructor() {}

	init(records: RecordingsResponse[]) {
		this.recordings = records;
	}

	async start() {
		try {
			const RecordingsResponse = await fetch("/api/recording/start", { method: "POST", body: "{}" });
			return await RecordingsResponse.json();
		} catch (err) {
			throw err;
		}
	}

	async stop() {
		try {
			this.clear();
			const RecordingsResponse = await fetch("/api/recording/stop", { method: "POST", body: "{}" });
			return await RecordingsResponse.json();
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
