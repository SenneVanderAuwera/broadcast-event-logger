import type { RecordingResponse } from "$lib/pocketbase/types";
import { ClientResponseError } from "pocketbase";
import type { PageLoad } from "./$types";
import { pb } from "$lib/pocketbase";

export const load = (async ({ params, fetch }) => {
	try {
		const eventsResponse = await pb.collection("event").getFullList({ filter: `recording="${params.id}"`, expand: "", sort: "timestamp", fetch });
		const recordingResponse = await pb.collection("recording").getOne(params.id, { fetch });

		return { events: eventsResponse, recording: recordingResponse };
	} catch (err) {
		if (err instanceof ClientResponseError && err.status !== 404) console.error(err);
		return { events: [], recording: {} as RecordingResponse };
	}
}) satisfies PageLoad;
