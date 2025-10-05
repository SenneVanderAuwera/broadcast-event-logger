import { pb } from "$lib/pocketbase";
import type { RecordingResponse } from "$lib/pocketbase/types";
import { getContext, onMount, setContext } from "svelte";

class Recording {
	active = $state(false);
	id = $state("");
	records: RecordingResponse[] = $state([]);

	constructor() {
		onMount(() => {
			pb.collection("recording").subscribe("*", (e) => {});

			return () => {
				pb.collection("recording").unsubscribe("*");
			};
		});
	}

	init(record: RecordingResponse) {
		if (!record) this.clear();

		if (record?.stop === "") {
			this.active = true;
			this.id = record.id;
		} else {
			this.clear();
		}
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
		} catch (err) {
			throw err;
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
