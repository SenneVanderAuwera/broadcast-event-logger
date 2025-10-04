import type { RecordingResponse } from "$lib/pocketbase/types";
import { ClientResponseError } from "pocketbase";
import type { PageServerLoad } from "./$types";

export const load = (async ({ params, fetch, locals }) => {
	try {
		const eventsResponse = await locals.pb.collection("event").getFullList({ filter: `recording="${params.id}"`, expand: "", sort: "timestamp", fetch });
		const recordingResponse = await locals.pb.collection("recording").getOne(params.id, { fetch });

		return { events: eventsResponse, recording: recordingResponse };
	} catch (err) {
		if (err instanceof ClientResponseError && err.status !== 404) console.error(err);
		return { events: [], recording: {} as RecordingResponse };
	}
}) satisfies PageServerLoad;
