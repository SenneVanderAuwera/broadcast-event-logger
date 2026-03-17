import { invalidate } from "$app/navigation";
import { pb } from "$lib/pocketbase";
import { Collections, type RecordingsResponse } from "$lib/pocketbase/types";
import { error } from "@sveltejs/kit";
import { getContext, onMount, setContext } from "svelte";

class RecordingController {
	#recordings: RecordingsResponse[];
	#activeRecording: RecordingsResponse | null;

	constructor() {
		this.#recordings = [];

		this.#activeRecording = $derived(this.#recordings.find((recording) => recording.stop === null) || null);

		onMount(() => {});
	}

	setRecordings(recordings: RecordingsResponse[]) {
		this.#recordings = recordings;
	}

	async getSelectedRecording(id: RecordingsResponse["id"]) {
		return this.#recordings.find((recording) => recording.id === id) || error(404, "Recording not found");
	}

	async startRecording() {
		try {
			return pb.collection(Collections.Recordings).create<RecordingsResponse>({
				start: new Date().toISOString(),
			});
		} catch (err) {}
	}

	async stopRecording() {
		if (this.#activeRecording) {
			try {
				await pb.collection(Collections.Recordings).update<RecordingsResponse>(this.#activeRecording.id, { stop: new Date().toISOString() });
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

export function setRecordingControllerCtx() {
	const controller = new RecordingController();
	return setContext(RECORDING_CONTROLLER_CTX, controller);
}

export function getRecordingControllerCtx() {
	return getContext<RecordingController>(RECORDING_CONTROLLER_CTX);
}
