import { createRecording, getRecordings, updateRecording } from "#lib/remote/recordings.remote.ts";
import { getRecordingEvents } from "#lib/remote/recording-events.remote.ts";

import { Collections } from "#lib/pocketbase/types.ts";
import { PocketbaseRecord } from "../pocketbase/index.svelte";

export class RecordingRecord extends PocketbaseRecord<Collections.Recordings> {
    selected = $state(false);

    update() {
        updateRecording($state.snapshot(this.record));
    }

    stop() {
        this.record.stop = new Date().toISOString();
        this.update();
    }

    archive() {
        this.record.archived = true;
        this.update();
    }

    restore() {
        this.record.archived = false;
        this.update();
    }
}

export class RecordingEventRecord extends PocketbaseRecord<Collections.RecordingEvents> {
}

export class RecordingsState {
    recordingsQuery: ReturnType<typeof getRecordings>;
    recordingEventsQuery: ReturnType<typeof getRecordingEvents>;

    recordings: RecordingRecord[];
    recordingEvents: RecordingEventRecord[];
    active: RecordingRecord | null;

    constructor() {
        this.recordingsQuery = getRecordings();
        this.recordingEventsQuery = getRecordingEvents();
        this.recordings = $derived(this.recordingsQuery.current?.map(record => new RecordingRecord(record)) ?? []);
        this.recordingEvents = $derived(this.recordingEventsQuery.current?.map(record => new RecordingEventRecord(record)) ?? []);
        this.active = $derived(this.recordings.find(recording => !recording.record.stop) ?? null);
    }

    startRecording() {
        if (this.active) {
            throw new Error("A recording is already active");
        }

        const newRecording = new RecordingRecord({ recording_name: "New Recording", start: new Date().toISOString() });
        return createRecording(newRecording.record);
    }

    stopActiveRecording() {
        if (!this.active) {
            throw new Error("No active recording to stop");
        }

        this.active.stop();
    }
}