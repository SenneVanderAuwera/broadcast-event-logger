import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "../$types";
import type { RecordingResponse } from "$lib/pocketbase/types";
import { ClientResponseError } from "pocketbase";
import { DateTime } from "luxon";

type RequestBodyParams = {
	stop: string;
};

export const POST: RequestHandler = async ({ request, locals }) => {
	const requestFormData = await request.formData();
	const formDataObject = Object.fromEntries(requestFormData.entries()) as RequestBodyParams;

	let recordingStopTimeFromRequest = DateTime.fromISO(formDataObject.stop);
	let recordingStopTime = DateTime.now();

	if (recordingStopTimeFromRequest.isValid) recordingStopTime = recordingStopTimeFromRequest;

	let activeRecording: RecordingResponse | undefined = undefined;

	try {
		activeRecording = await locals.pb.collection("recording").getFirstListItem(`stop=null`);
	} catch (err) {
		if (err instanceof ClientResponseError) {
			if (err.status === 404) {
				error(400, "No active recording found");
			}
		}
	}

	try {
		const recordingResponse = await locals.pb.collection("recording").update(activeRecording?.id ?? "", { stop: recordingStopTime.toSQL() });
	} catch (err) {
		error(500, "Failed to stop recording entry");
	}

	return json({ message: "Recording stopped" });
};
