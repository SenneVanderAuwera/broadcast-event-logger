import { query } from "$app/server";
import { pb } from "$lib/pocketbase";
import type { RecordingsResponse } from "$lib/pocketbase/types";

export const getRecordings = query(async () => {
	const recordings = await pb.collection("recording").getFullList<RecordingsResponse>({
		sort: "-created",
	});

	return recordings;
});
