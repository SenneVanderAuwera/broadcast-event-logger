import { command, query } from "$app/server";

import { Collections } from "#lib/pocketbase/types.ts";
import type { RecordingRecord } from "#lib/state/recordings.svelte.ts";
import { pb } from "../pocketbase/index.svelte";

export const getRecordings = query(async () => {
    const records = await pb.collection(Collections.Recordings).getFullList();
    return records;
});

export const createRecording = command("unchecked",
    async (data: RecordingRecord) => {
        const record = await pb.collection(Collections.Recordings).create(data.record);
        return record;
    }
);

export const updateRecording = command("unchecked",
    async (data: RecordingRecord) => {
        const record = await pb.collection(Collections.Recordings).update(data.record.id, data.record);
        return record;
    }
);