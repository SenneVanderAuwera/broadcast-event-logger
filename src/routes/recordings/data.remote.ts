import { query } from "$app/server";
import { pb } from "$lib/pocketbase";
import { Collections, type RecordingsResponse } from "$lib/pocketbase/types";

export const getRecordings = query(async () => {
	const recordings = await pb.collection(Collections.Recordings).getFullList<RecordingsResponse>({
		sort: "-created",
	});

	return recordings;
});
