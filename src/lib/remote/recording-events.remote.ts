import { command, query } from "$app/server";
import * as v from "valibot";

import { Collections, type RecordingEventsResponse } from "#lib/pocketbase/types.ts";
import { pb } from "../pocketbase/index.svelte";

export const getRecordingEvent = query(v.string(), async (id: string) => {
    const record = await pb.collection(Collections.RecordingEvents).getOne(id);
    return record;
});

export const getRecordingEvents = query(async () => {
    const records = await pb.collection(Collections.RecordingEvents).getFullList();
    return records;
});

export const createRecordingEvent = command("unchecked",
    async (data: RecordingEventsResponse) => {
        const record = await pb.collection(Collections.RecordingEvents).create(data);
        return record;
    }
);

export const updateRecordingEvent = command("unchecked",
    async (data: RecordingEventsResponse) => {
        const record = await pb.collection(Collections.RecordingEvents).update(data.id, data);
        return record;
    }
);