import { Collections } from "#lib/pocketbase/types.ts";
import { pb } from "../pocketbase";
import { query } from "$app/server";

export const getRecordings = query(async () => {
    const records = await pb.collection(Collections.Recordings).getFullList();
    return records;
});