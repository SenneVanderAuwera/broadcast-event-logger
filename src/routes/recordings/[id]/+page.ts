import { Collections, type RecordingEventsResponse, type RecordingsResponse } from "$lib/pocketbase/types";
import { ClientResponseError } from "pocketbase";
import type { PageLoad } from "./$types";
import { pb } from "$lib/pocketbase";

export const load = (async ({ params, fetch }) => {
	try {
		const recordingResponse = pb.collection(Collections.Recordings).getOne(params.id, { fetch });
		const eventsResponse = pb.collection(Collections.RecordingEvents).getFullList({ filter: `recording="${params.id}"`, expand: "", sort: "timestamp", fetch });

		return { recording: await recordingResponse, events: await eventsResponse };
	} catch (err) {
		if (err instanceof ClientResponseError && err.status !== 404) console.error(err);
	}
	return { events: [] as RecordingEventsResponse[], recording: {} as RecordingsResponse };
}) satisfies PageLoad;
