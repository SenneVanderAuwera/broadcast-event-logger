import { invalidate } from "$app/navigation";
import { pb } from "$lib/pocketbase";
import type { RecordingsResponse } from "$lib/pocketbase/types";
import { Collections } from "$lib/pocketbase/types";
import { createContext } from "svelte";

export class RecordingController {
	#recordings: RecordingsResponse[] = $state([]);
	#activeRecording: RecordingsResponse | null = $derived.by(() => {
		return this.#recordings.find((recording) => !recording.stop) || null;
	});

	constructor() {
		this.#recordings = [];
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

export const [getRecordingControllerCtx, setRecordingControllerCtx] = createContext<RecordingController>();
