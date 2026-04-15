import { ClientResponseError } from "pocketbase";
import type { PageLoad } from "./$types";
import { pb } from "$lib/pocketbase";
import { Collections } from "$lib/pocketbase/types";

export const load = (async ({ fetch, depends }) => {
    depends("recordings:archived");
    try {
        const recordingsResult = await pb.collection(Collections.Recordings).getFullList({ filter: "archived=true", sort: "-created", fetch });
        return { recordings: recordingsResult };
    } catch (err) {
        if (err instanceof ClientResponseError && err.status !== 404) console.error(err);
        return { recordings: [] };
    }
}) satisfies PageLoad;
