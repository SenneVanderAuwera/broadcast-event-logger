import { getRecordings } from "#lib/remote/recordings.remote.ts";

export class RecordingsState implements RecordingsState {
    #query: ReturnType<typeof getRecordings>;
    recordings: Awaited<ReturnType<typeof getRecordings>>;

    constructor() {
        this.#query = getRecordings();
        this.recordings = $derived(this.#query.current ?? []);
    }
}