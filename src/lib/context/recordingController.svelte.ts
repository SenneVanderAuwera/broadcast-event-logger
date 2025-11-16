import type { RecordingResponse } from "$lib/pocketbase/types";
import { getContext, onMount, setContext } from "svelte";

class RecordingController {
	#recordings: RecordingResponse[] = $state([]);
	#activeRecording: RecordingResponse | null = $derived.by(() => {
		return this.#recordings.find((recording) => !recording.stop) || null;
	});

	constructor() {
		onMount(() => {});
	}

	get recordings() {
		return this.#recordings;
	}

	get status() {
		return {
			isActive: this.#activeRecording !== null,
			activeRecording: this.#activeRecording,
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
