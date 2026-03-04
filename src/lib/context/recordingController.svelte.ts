import { invalidate } from "$app/navigation";
import { pb } from "$lib/pocketbase";
import type { RecordingResponse } from "$lib/pocketbase/types";
import { getContext, onMount, setContext } from "svelte";

class RecordingController {
	#recordings: RecordingResponse[];
	#activeRecording: RecordingResponse | null;

	constructor() {
		this.#recordings = [];

		this.#activeRecording = $derived(this.#recordings.find((recording) => recording.stop === null) || null);

		onMount(() => {});
	}

	setRecordings(recordings: RecordingResponse[]) {
		this.#recordings = recordings;
	}

	async getSelectedRecording(id: RecordingResponse["id"]) {
		return (await this.#recordings).find((recording) => recording.id === id) || null;
	}

	async startRecording() {
		try {
			return pb.collection("recording").create<RecordingResponse>({
				start: new Date().toISOString(),
			});
		} catch (err) {}
	}

	async stopRecording() {
		if (this.#activeRecording) {
			try {
				await pb.collection("recording").update<RecordingResponse>(this.#activeRecording.id, { stop: new Date().toISOString() });
				invalidate("recordings:non-archived");
			} catch (err) {}
		}
	}

	get recordings() {
		return this.#recordings;
	}

	set recordings(value: RecordingResponse[]) {
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

export function setRecordingControllerCtx() {
	const controller = new RecordingController();
	return setContext(RECORDING_CONTROLLER_CTX, controller);
}

export function getRecordingControllerCtx() {
	return getContext<RecordingController>(RECORDING_CONTROLLER_CTX);
}
