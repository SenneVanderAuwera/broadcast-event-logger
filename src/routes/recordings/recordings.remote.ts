import { Collections } from "$lib/pocketbase/types";
import { pb } from "$lib/pocketbase";
import { query } from "$app/server";

export const getRecordings = query(async () => {
    const recordingsResult = await pb.collection(Collections.Recordings).getFullList();
    
    return recordingsResult;
});