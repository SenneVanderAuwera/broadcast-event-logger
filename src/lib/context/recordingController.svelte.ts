import { invalidate } from "$app/navigation";
import { pb } from "$lib/pocketbase";
import type { RecordingResponse } from "$lib/pocketbase/types";
import { getContext, onMount, setContext } from "svelte";

class RecordingController {
	#recordings: RecordingResponse[] = $state([]);
	#activeRecording: RecordingResponse | null = $derived.by(() => {
		return this.#recordings.find((recording) => !recording.stop) || null;
	});

	constructor(data: RecordingResponse[]) {
		this.#recordings = data;

		onMount(() => {});
	}

	getSelectedRecording(id: RecordingResponse["id"]) {
		return this.#recordings.find((recording) => recording.id === id) || null;
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

export function setRecordingControllerCtx(data: RecordingResponse[]) {
	const controller = new RecordingController(data);
	return setContext(RECORDING_CONTROLLER_CTX, controller);
}

export function getRecordingControllerCtx() {
	return getContext<RecordingController>(RECORDING_CONTROLLER_CTX);
}
