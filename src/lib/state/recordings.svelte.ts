import { getRecordingEvents } from "#lib/remote/recording-events.remote.ts";
import { createRecording, getRecording, getRecordings, updateRecording } from "#lib/remote/recordings.remote.ts";

import { Collections } from "#lib/pocketbase/types.ts";
import { PocketbaseRecord } from "../pocketbase/index.svelte";
import { DateTime } from "luxon";

export class RecordingRecord extends PocketbaseRecord<Collections.Recordings> {
    selected = $state(false);
    recordingEventsQuery = $derived(getRecordingEvents(this.record.id));
    recordingEvents = $derived(this.recordingEventsQuery.current?.map(record => new RecordingEventRecord(record)) ?? []);

    isActive() {
        return this.record.stop === "";
    }

    update() {
        updateRecording($state.snapshot(this.record));
    }

    stop() {
        this.record.stop = DateTime.now().toSQL();
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

    toJSON() {
        return $state.snapshot(this.record);
    }
}

export class RecordingEventRecord extends PocketbaseRecord<Collections.RecordingEvents> {
    toJSON() {
        return $state.snapshot(this.record);
    }
}

export class RecordingsState {
    recordingsQuery: ReturnType<typeof getRecordings>;

    recordingQueryById?: ReturnType<typeof getRecording>;

    recordings: RecordingRecord[];
    active: RecordingRecord | null;

    constructor({ archived = false } = {}) {
        this.recordingsQuery = getRecordings({ archived });
        this.recordings = $derived(this.recordingsQuery.current?.map(record => new RecordingRecord(record)) ?? []);
        this.active = $derived(this.recordings.find(recording => recording.record.stop === "") ?? null);
    }

    async getRecordingById(id: string) {
        try {
            this.recordingQueryById = getRecording(id);
            const recordingRecord = new RecordingRecord(await this.recordingQueryById);
            return recordingRecord;
        } catch (err) {
            throw err;
        }
    }

    startRecording() {
        if (this.active) {
            throw new Error("A recording is already active");
        }

        const newRecording = new RecordingRecord({ recording_name: "New Recording", start: DateTime.now().toSQL() });
        return createRecording(newRecording.record);
    }

    stopActiveRecording() {
        if (!this.active) {
            throw new Error("No active recording to stop");
        }

        this.active.stop();
    }
}