import { createRecording, getRecording, getRecordings, updateRecording } from "#lib/remote/recordings.remote.ts";

import { Collections, type RecordingsResponse } from "#lib/pocketbase/types.ts";
import { DateTime } from "luxon";
import { PocketbaseRecord } from "../pocketbase/index.svelte";
import { getRecordingEvents } from "#lib/remote/recording-events.remote.ts";

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
    recordings: RecordingRecord[];
    active: RecordingRecord | null;

    constructor({ archived = false, recordings }: { archived?: boolean, recordings: RecordingsResponse[] } = {recordings: []}) {
        this.recordings = $derived(recordings.map(recording => new RecordingRecord(recording)) ?? []);
        this.active = $derived(this.recordings.find(recording => recording.record.stop === "") ?? null);
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