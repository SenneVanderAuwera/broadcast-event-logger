import type { Collections } from "#lib/pocketbase/types.ts";
import { PocketbaseRecord } from "../pocketbase";
import { getRecordings } from "#lib/remote/recordings.remote.ts";

export class RecordingRecord extends PocketbaseRecord<Collections.Recordings> { }

export class RecordingsState implements RecordingsState {
    #query: ReturnType<typeof getRecordings>;
    recordings: RecordingRecord[];

    constructor() {
        this.#query = getRecordings();
        this.recordings = $derived(this.#query.current?.map(record => new RecordingRecord(record)) ?? []);
    }
}