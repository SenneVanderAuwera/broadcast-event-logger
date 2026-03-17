import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { Collections, type RecordingsResponse } from "$lib/pocketbase/types";
import { ClientResponseError } from "pocketbase";
import { DateTime } from "luxon";

type RequestBodyParams = {
	stop: string;
};

export const POST: RequestHandler = async ({ request, locals }) => {
	const requestBody: RequestBodyParams = await request.json();

	let recordingStopTimeFromRequest = DateTime.fromISO(requestBody.stop);
	let recordingStopTime = DateTime.now();

	if (recordingStopTimeFromRequest.isValid) recordingStopTime = recordingStopTimeFromRequest;

	let activeRecording: RecordingsResponse | undefined = undefined;

	try {
		activeRecording = await locals.pb.collection(Collections.Recordings).getFirstListItem(`stop=null`);
	} catch (err) {
		if (err instanceof ClientResponseError) {
			if (err.status === 404) {
				error(400, "No active recording found");
			}
		}
	}

	try {
		const RecordingsResponse = await locals.pb.collection(Collections.Recordings).update(activeRecording?.id ?? "", { stop: recordingStopTime.toSQL() });
		return json({ message: "Recording stopped", data: RecordingsResponse });
	} catch (err) {
		error(500, "Failed to stop recording entry");
	}
};
