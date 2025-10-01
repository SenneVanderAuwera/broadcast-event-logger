import { pb } from "$lib/pocketbase";
import type { RecordingResponse } from "$lib/pocketbase/types";
import { ClientResponseError } from "pocketbase";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params }) => {
	try {
		const eventsResponse = await pb.collection("event").getFullList({ filter: `recording="${params.id}"`, expand: "", sort: "timestamp" });
		const recordingResponse = await pb.collection("recording").getOne(params.id);

		return { events: eventsResponse, recording: recordingResponse };
	} catch (err) {
		if (err instanceof ClientResponseError && err.status !== 404) console.error(err);
		return { events: [], recording: {} as RecordingResponse };
	}
}) satisfies PageServerLoad;
