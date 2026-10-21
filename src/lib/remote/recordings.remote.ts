import { command, query } from "$app/server";
import * as v from "valibot";

import { Collections, type RecordingsResponse } from "#lib/pocketbase/types.ts";
import { pb } from "../pocketbase/index.svelte";

export const getRecording = query(v.string(), async (id) => {
    const record = await pb.collection(Collections.Recordings).getOne(id);
    return record;
});

export const getRecordings = query(async () => {
    const records = await pb.collection(Collections.Recordings).getFullList();
    return records;
});

export const createRecording = command("unchecked",
    async (data: RecordingsResponse) => {
        const record = await pb.collection(Collections.Recordings).create(data);
        return record;
    }
);

export const updateRecording = command("unchecked",
    async (data: RecordingsResponse) => {
        const record = await pb.collection(Collections.Recordings).update(data.id, data);
        return record;
    }
);