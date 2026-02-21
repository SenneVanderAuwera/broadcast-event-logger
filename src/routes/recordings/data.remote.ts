import { query } from "$app/server";
import { pb } from "$lib/pocketbase";
import type { RecordingResponse } from "$lib/pocketbase/types";

export const getRecordings = query(async () => {
	const recordings = await pb.collection("recording").getFullList<RecordingResponse>({
		sort: "-created",
	});

	return recordings;
});
