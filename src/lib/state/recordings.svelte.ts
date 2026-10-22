import { createRecording, getRecordings, updateRecording } from "#lib/remote/recordings.remote.ts";

import { Collections } from "#lib/pocketbase/types.ts";
import { PocketbaseRecord } from "../pocketbase/index.svelte";

export class RecordingRecord extends PocketbaseRecord<Collections.Recordings> {
    selected = $state(false);

    archive() {
        this.record.archived = true;
        updateRecording($state.snapshot(this.record));
    }

    restore() {
        this.record.archived = false;
        updateRecording($state.snapshot(this.record));
    }
}

export class RecordingEventRecord extends PocketbaseRecord<Collections.RecordingEvents> {
}

export class RecordingsState {
    #query: ReturnType<typeof getRecordings>;

    recordings: RecordingRecord[];
    recordingEvents: RecordingEventRecord[];
    active: RecordingRecord | null;

    constructor() {
        this.#query = getRecordings();
        this.recordings = $derived(this.#query.current?.map(record => new RecordingRecord(record)) ?? []);
        this.recordingEvents = $derived([]);
        this.active = $derived(this.recordings.find(recording => !recording.record.stop) ?? null);
    }

    startRecording() {
        if (this.active) {
            throw new Error("A recording is already active");
        }

        const newRecording = new RecordingRecord({ recording_name: "New Recording", start: new Date().toISOString() });
        return createRecording(newRecording.record);
    }
}