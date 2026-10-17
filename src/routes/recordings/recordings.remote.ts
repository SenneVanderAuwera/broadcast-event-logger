import { Collections } from "#lib/pocketbase/types.ts";
import { pb } from "#lib/pocketbase/index.ts";
import { query } from "$app/server";

export const getRecordings = query(async () => {
    const recordingsResult = await pb.collection(Collections.Recordings).getFullList();
    
    return recordingsResult;
});