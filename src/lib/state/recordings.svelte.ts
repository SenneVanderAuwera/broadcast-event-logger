import { createRecording, getRecordings } from "#lib/remote/recordings.remote.ts";

import type { Collections } from "#lib/pocketbase/types.ts";
import { PocketbaseRecord } from "../pocketbase";

export class RecordingRecord extends PocketbaseRecord<Collections.Recordings> { }

export class RecordingsState {
    #query: ReturnType<typeof getRecordings>;

    recordings: RecordingRecord[];
    active: RecordingRecord | null = null;

    constructor() {
        this.#query = getRecordings();
        this.recordings = $derived(this.#query.current?.map(record => new RecordingRecord(record)) ?? []);
        this.active = $derived(this.recordings.find(recording => !recording.record.stop) ?? null);
    }

    startRecording() {
        if (this.active) {
            throw new Error("A recording is already active");
        }

        const newRecording = RecordingRecord.fromObject<Collections.Recordings>({ recording_name: "New Recording", start: new Date().toISOString() });
        createRecording(newRecording);
    }
}