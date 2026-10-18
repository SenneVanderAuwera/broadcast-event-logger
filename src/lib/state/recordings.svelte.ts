import { createRecording, getRecordings, updateRecording } from "#lib/remote/recordings.remote.ts";

import { Collections } from "#lib/pocketbase/types.ts";
import { PocketbaseRecord } from "../pocketbase/index.svelte";

export class RecordingRecord extends PocketbaseRecord<Collections.Recordings> {
    selected = $state(false);

    archiveRecording() {
        this.record.archived = true;
        updateRecording(this);
    }

    restoreRecording() {
        this.record.archived = false;
        updateRecording(this);
    }
}

export class RecordingsState {
    #query: ReturnType<typeof getRecordings>;

    recordings: RecordingRecord[];
    active: RecordingRecord | null;

    constructor() {
        this.#query = getRecordings();
        this.recordings = $derived(this.#query.current?.map(record => new RecordingRecord(record)) ?? []);
        this.active = $derived(this.recordings.find(recording => !recording.record.stop) ?? null);
    }

    startRecording() {
        if (this.active) {
            throw new Error("A recording is already active");
        }

        const newRecording = new RecordingRecord({ recording_name: "New Recording", start: new Date().toISOString() });
        return createRecording(newRecording);
    }
}