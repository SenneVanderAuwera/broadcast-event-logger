import type { RecordingRecord } from "$lib/pocketbase/types";
import { getContext, setContext } from "svelte";

class Recording {
	active = $state(false);
	id = $state("");

	constructor() {}

	init(record: RecordingRecord) {
		if (record) {
			this.active = true;
			this.id = record.id;
		} else {
			this.clear();
		}
	}

	clear() {
		this.active = false;
		this.id = "";
	}
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
