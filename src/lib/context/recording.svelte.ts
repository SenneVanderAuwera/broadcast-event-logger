import { getContext, setContext } from "svelte";

class Recording {
	active = $state(false);

	constructor() {}
}

const RECORDING_CTX = Symbol("recording");

export function createRecordingContext() {
	const recording = new Recording();
	setContext(RECORDING_CTX, recording);
	return recording;
}

export function getRecordingContext() {
	return getContext<ReturnType<typeof createRecordingContext>>(RECORDING_CTX);
}
