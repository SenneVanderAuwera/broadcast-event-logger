import { invalidate } from "$app/navigation";
import { pb } from "$lib/pocketbase";
import type { RecordingsResponse } from "$lib/pocketbase/types";
import { getContext, onMount, setContext } from "svelte";
import { Collections } from "$lib/pocketbase/types";

class RecordingController {
	#recordings: RecordingsResponse[] = $state([]);
	#activeRecording: RecordingsResponse | null = $derived.by(() => {
		return this.#recordings.find((recording) => !recording.stop) || null;
	});

	constructor(data: RecordingsResponse[]) {
		this.#recordings = data;

		onMount(() => {});
	}

	getSelectedRecording(id: RecordingsResponse["id"]) {
		return this.#recordings.find((recording) => recording.id === id) || null;
	}

	async startRecording() {
		try {
			return pb.collection(Collections.Recordings).create({
				start: new Date().toISOString(),
			});
		} catch (err) {
			if (err instanceof Error) console.error(err);
			throw new Error("Error starting recording");
		}
	}

	async stopRecording() {
		if (this.#activeRecording) {
			try {
				await pb.collection(Collections.Recordings).update(this.#activeRecording.id, { stop: new Date().toISOString() });
				invalidate("recordings:non-archived");
			} catch (err) {}
		}
	}

	get recordings() {
		return this.#recordings;
	}

	set recordings(value: RecordingsResponse[]) {
		this.#recordings = value;
	}

	get data() {
		return {
			active: this.#activeRecording !== null,
			record: this.#activeRecording,
		};
	}
}

const RECORDING_CONTROLLER_CTX = Symbol("recordingController");

export function setRecordingControllerCtx(data: RecordingsResponse[]) {
	const controller = new RecordingController(data);
	return setContext(RECORDING_CONTROLLER_CTX, controller);
}

export function getRecordingControllerCtx() {
	return getContext<RecordingController>(RECORDING_CONTROLLER_CTX);
}
