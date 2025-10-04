import type { RecordingRecord, RecordingResponse } from "$lib/pocketbase/types";
import { getContext, setContext } from "svelte";

class Recording {
	active = $state(false);
	id = $state("");

	constructor() {}

	init(record: RecordingRecord) {
		this.active = false;
		this.id = "";

		if (!record) this.clear();
		if (record?.stop === "") {
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

	toJSON() {
		return {
			active: this.active,
			id: this.id,
		};
	}
}

const RECORDING_CTX = Symbol("recording");

export function createRecordingContext(record?: RecordingResponse) {
	const recording = new Recording();
	setContext(RECORDING_CTX, recording);

	if (record) {
		recording.init(record);
	}

	return recording;
}

export function getRecordingContext() {
	return getContext<ReturnType<typeof createRecordingContext>>(RECORDING_CTX);
}
